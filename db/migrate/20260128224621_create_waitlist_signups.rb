class CreateWaitlistSignups < ActiveRecord::Migration[8.0]
  def change
    # Use the same table name as the old Node.js server to preserve existing data
    unless table_exists?(:waitlist)
      create_table :waitlist do |t|
        t.string :email, null: false
        t.string :platform, null: false

        t.timestamps
      end
      add_index :waitlist, :email, unique: true
      add_index :waitlist, :created_at
    end
  end
end
