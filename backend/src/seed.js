import bcrypt from 'bcrypt';
import { query, pool } from './config/db.js';

(async () => {
  const passwordHash = await bcrypt.hash('121212', 10);

  await query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    ['wanglin@gmail.com', passwordHash],
  );

  await query(
    `INSERT INTO about(name, title, short_bio, full_bio, profile_photo)
     SELECT $1,$2,$3,$4,$5
     WHERE NOT EXISTS (SELECT 1 FROM about)`,
    [
      'WANG LIN',
      'Ascendant GOD',
      'reflecting a quiet strength born of countless years of hardship and experience. His posture is relaxed yet purposeful, and he moves with a steady confidence that does not seek to attract attention. To the casual observer, he might seem ordinary or even forgettable. However, beneath this plain exterior lies an aura of ancient loneliness and deep wisdom, as if he carries the weight of many lifetimes within him.',
      'Wang Lin is a man shaped by immense loss, quiet resilience, and a deep yearning for something greater than himself. In his early life he is a modest and intelligent youth, filled with hope and a desire to bring pride to his family. His humble beginnings are marked by simplicity and warmth, but this fragile peace is shattered by events beyond his control. The pain of separation and helplessness plants a seed of transformation within him. Stripped of the life he once knew, Wang Lin steps into a larger and colder world where only strength earns respect and survival often comes at the cost of innocence. This early trauma becomes the fire that fuels his pursuit of growth, not out of ambition, but from a desperate need to protect himself and the memories of those he holds dear.',
      'https://via.placeholder.com/400x400?text=WANG+LIN',
    ],
  );

  await query(
    `INSERT INTO skills(name, level)
     SELECT * FROM (VALUES ('Withering Dao',100), ('Celestial Emperor Crown',100), ('Karmic Insight',98)) AS v(name,level)
     WHERE NOT EXISTS (SELECT 1 FROM skills)`,
  );

  await query(
    `INSERT INTO contact_info(email, whatsapp, linkedin, github, location)
     SELECT $1,$2,$3,$4,$5
     WHERE NOT EXISTS (SELECT 1 FROM contact_info)`,
    ['WANG LIN', 'WANGLIN', 'WANGLIN', 'WANGLIN', 'Country of Zhao'],
  );

  console.log('Seed complete');
  await pool.end();
})();
