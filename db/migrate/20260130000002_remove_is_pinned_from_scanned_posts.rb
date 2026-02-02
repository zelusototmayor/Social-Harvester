class RemoveIsPinnedFromScannedPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :scanned_posts, :is_pinned, :boolean, default: false
  end
end
