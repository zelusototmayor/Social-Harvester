class CreatePlans < ActiveRecord::Migration[7.1]
  def change
    create_table :plans do |t|
      t.string :name, null: false
      t.string :stripe_product_id
      t.string :stripe_price_id
      t.integer :price_cents, null: false, default: 0
      t.string :interval, null: false, default: 'month'
      t.integer :products_limit
      t.integer :sources_per_product_limit
      t.integer :scans_per_month_limit
      t.integer :leads_per_month_limit
      t.boolean :active, null: false, default: true
      t.integer :sort_order, null: false, default: 0

      t.timestamps
    end

    add_index :plans, :stripe_price_id, unique: true
    add_index :plans, :name, unique: true
  end
end
