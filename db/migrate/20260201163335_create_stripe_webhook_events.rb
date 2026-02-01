class CreateStripeWebhookEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :stripe_webhook_events do |t|
      t.string :event_id
      t.string :event_type
      t.datetime :processed_at

      t.timestamps
    end
    add_index :stripe_webhook_events, :event_id, unique: true
  end
end
