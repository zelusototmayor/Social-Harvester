class ScheduledScanJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "Starting scheduled scan at #{Time.current}"

    # Queue all influencers that need scraping (haven't been scraped in 6+ hours)
    influencers_count = 0
    Influencer.needs_scraping.find_each do |influencer|
      ScrapeInfluencerJob.perform_later(influencer.id)
      influencers_count += 1
    end

    # Queue all hashtags that need scraping (haven't been scraped in 6+ hours)
    hashtags_count = 0
    Hashtag.needs_scraping.find_each do |hashtag|
      ScrapeHashtagJob.perform_later(hashtag.id)
      hashtags_count += 1
    end

    Rails.logger.info "Scheduled scan complete: #{influencers_count} influencers and #{hashtags_count} hashtags queued"
  end
end
