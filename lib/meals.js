import fs from 'node:fs'
import slugify from 'slugify';
import xss from 'xss';

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function getMeals() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const meals = await sql`SELECT * FROM meals`;
    return meals.rows;
  } catch (error) {
    console.error('Error retrieving meals:', error);
    return [];
  }
}

export async function getMeal(slug){
  try {
    // #TODO: verify protection against SQL Injection attacks
    // aparently Vercel already protects this from those
    const query = sql`SELECT * FROM meals WHERE slug = ${slug}`
    const result = await query;

    const meal = result.rows[0]

    return meal
  } catch (error) {
    console.error('Error retrieving this meal:', error);
    return null;
  }
}

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
  
  try {
    await sql`
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (
        ${meal.title},
        ${meal.summary},
        ${meal.instructions},
        ${meal.creator},
        ${meal.creator_email},
        ${meal.image},
        ${meal.slug}
      )
    `;
  } catch (error) {
    console.error('Error saving meal:', error);
    throw new Error('Saving meal failed!');
  }
}