import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the incoming request body to get the meal data
    const { title, slug, image, summary, instructions, creator, creator_email } = await request.json();

    // Insert the new meal into the database
    const result = await sql`
      INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
      VALUES (
         ${slug}, 
         ${title}, 
         ${image}, 
         ${summary}, 
         ${instructions}, 
         ${creator}, 
         ${creator_email}
      )
      RETURNING *;
    `;

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* 
export async function saveMeal(meal){
   meal.slug = slugify(meal.title, {lower: true})
   meal.instructions = xss(meal.instructions)
   
   const extension = meal.image.name.split('.').pop()
   const fileName = `${meal.slug}.${extension}`
 
   const stream = fs.createWriteStream(`public/images/${fileName}`)
   const bufferedImage = await meal.image.arrayBuffer()
 
   stream.write(Buffer.from(bufferedImage), (error) => {
     if (error) {
       throw new Error('Saving image failed!')
     }
   })
 
   meal.image = `/images/${fileName}`
 
   db.prepare(`
     INSERT INTO meals
       (title, summary, instructions, creator, creator_email, image, slug)
     VALUES (
       @title,
       @summary,
       @instructions,
       @creator,
       @creator_email,
       @image,
       @slug
     )
   `).run(meal)
 }
 */