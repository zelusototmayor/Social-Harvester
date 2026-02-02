class AddOnboardingFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :company_size, :string
    add_column :users, :employee_count, :string
    add_column :users, :referral_source, :string
    add_column :users, :onboarding_completed, :boolean, default: false, null: false
  end
end
