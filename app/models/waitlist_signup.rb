class WaitlistSignup < ApplicationRecord
  self.table_name = "waitlist"

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "is invalid" }
  validates :platform, presence: true, inclusion: { in: %w[Instagram TikTok] }

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase.strip
  end
end
