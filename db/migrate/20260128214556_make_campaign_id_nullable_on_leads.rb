class MakeCampaignIdNullableOnLeads < ActiveRecord::Migration[8.0]
  def change
    change_column_null :leads, :campaign_id, true
  end
end
