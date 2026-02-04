class ScanProgressService
  TTL = 30.minutes.to_i

  def initialize(product_id)
    @product_id = product_id
    @key = "scan:product:#{product_id}:current"
  end

  def start_scan!(scan_id, total_sources, source_names)
    Sidekiq.redis do |conn|
      conn.multi do |r|
        r.del(@key)
        r.hset(@key,
          "scan_id", scan_id,
          "status", "scanning",
          "total_sources", total_sources,
          "completed_sources", 0,
          "failed_sources", 0,
          "leads_found", 0,
          "current_source", source_names.first || "",
          "current_stage", "queued",
          "detail", "",
          "source_names", source_names.join(","),
          "errors", "",
          "started_at", Time.current.iso8601
        )
        r.expire(@key, TTL)
      end
    end
  end

  def update_source(scan_id, source_name, stage, detail = "")
    return unless current_scan?(scan_id)

    Sidekiq.redis do |conn|
      conn.hset(@key,
        "current_source", source_name,
        "current_stage", stage,
        "detail", detail
      )
    end
  end

  def increment_leads_found(scan_id, count)
    return unless current_scan?(scan_id)

    Sidekiq.redis { |conn| conn.hincrby(@key, "leads_found", count) }
  end

  def complete_source(scan_id, source_name)
    return unless current_scan?(scan_id)

    Sidekiq.redis do |conn|
      completed = conn.hincrby(@key, "completed_sources", 1)
      total = conn.hget(@key, "total_sources").to_i
      failed = conn.hget(@key, "failed_sources").to_i

      if completed + failed >= total
        conn.hset(@key, "status", "completed", "current_source", "", "current_stage", "done", "detail", "")
      end
    end
  end

  def fail_source(scan_id, source_name, error)
    return unless current_scan?(scan_id)

    Sidekiq.redis do |conn|
      conn.hincrby(@key, "failed_sources", 1)
      existing_errors = conn.hget(@key, "errors") || ""
      new_errors = existing_errors.empty? ? "#{source_name}: #{error}" : "#{existing_errors}|#{source_name}: #{error}"
      conn.hset(@key, "errors", new_errors)

      completed = conn.hget(@key, "completed_sources").to_i
      total = conn.hget(@key, "total_sources").to_i
      failed = conn.hget(@key, "failed_sources").to_i

      if completed + failed >= total
        conn.hset(@key, "status", "completed", "current_source", "", "current_stage", "done", "detail", "")
      end
    end
  end

  def cancel_scan!
    Sidekiq.redis do |conn|
      scan_id = conn.hget(@key, "scan_id")
      if scan_id
        conn.hset(@key, "status", "completed", "current_source", "", "current_stage", "done", "detail", "Scan stopped by user")
        conn.expire(@key, 30) # Short TTL so it clears quickly
      end
    end
  end

  def current_status
    data = Sidekiq.redis { |conn| conn.hgetall(@key) }
    return { status: "idle" } if data.empty?

    {
      status: data["status"],
      scan_id: data["scan_id"],
      total_sources: data["total_sources"].to_i,
      completed_sources: data["completed_sources"].to_i,
      failed_sources: data["failed_sources"].to_i,
      leads_found: data["leads_found"].to_i,
      current_source: data["current_source"],
      current_stage: data["current_stage"],
      detail: data["detail"],
      errors: data["errors"].present? ? data["errors"].split("|") : [],
      started_at: data["started_at"]
    }
  end

  def cancelled?(scan_id)
    status = Sidekiq.redis { |conn| conn.hget(@key, "status") }
    status != "scanning" || !current_scan?(scan_id)
  end

  private

  def current_scan?(scan_id)
    Sidekiq.redis { |conn| conn.hget(@key, "scan_id") } == scan_id
  end
end
