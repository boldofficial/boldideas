const { readFileSync } = require('fs');
const postgres = require('postgres');

const url = process.env.DATABASE_URL || 'postgresql://boldideas:boldideas_dev@localhost:15432/boldideas';
const sql = postgres(url);

async function main() {
  try {
    const sqlContent = readFileSync('scripts/update-cover-images.sql', 'utf8');
    await sql.unsafe(sqlContent);
    console.log('Cover images updated successfully');
    
    // Verify
    const posts = await sql`SELECT slug, cover_image FROM posts WHERE cover_image IS NOT NULL`;
    console.log(`\n${posts.length} posts now have cover images:`);
    posts.forEach(p => console.log(`  - ${p.slug}: ${p.cover_image.substring(0, 60)}...`));
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
