class UsageRecord < ApplicationRecord
  belongs_to :organization

  validates :period_start, presence: true
  validates :period_end, presence: true
  validates :scans_count, numericality: { greater_than_or_equal_to: 0 }
  validates :leads_count, numericality: { greater_than_or_equal_to: 0 }
  validates :organization_id, uniqueness: { scope: :period_start }

  # Get or create the current period's usage record
  def self.current_for(organization)
    period_start = Time.current.beginning_of_month.to_date
    period_end = Time.current.end_of_month.to_date

    find_or_create_by!(organization: organization, period_start: period_start) do |record|
      record.period_end = period_end
    end
  end

  def increment_scans!(count = 1)
    increment!(:scans_count, count)
  end

  def increment_leads!(count = 1)
    increment!(:leads_count, count)
  end
end
