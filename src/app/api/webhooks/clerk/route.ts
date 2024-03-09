import { db } from "@/server/db";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const evt = body as WebhookEvent;

  switch (evt.type) {
    case "user.created": {
      const id = evt.data.id;
      const name = evt.data.first_name;
      const image = evt.data.image_url;
      if (!name || !image) return Response.json({ success: false }, { status: 500 });

      await db.user.create({
        data: {
          id,
          name,
          imageUrl: image
        }
      });

      break;
    }
    case "user.updated": {
      const id = evt.data.id;
      const name = evt.data.first_name;
      const image = evt.data.image_url;
      if (!name || !image) return Response.json({ success: false }, { status: 500 });

      const user = await db.user.findUnique({ where: { id } });
      if (!user) return Response.json({ success: false }, { status: 404 });

      await db.user.update({
        where: { id },
        data: {
          name,
          imageUrl: image
        }
      });

      break;
    }
    default: {
      console.log(`Unhandled Clerk event ${evt.type}`);
      break;
    }
  }

  return Response.json({ success: true }, { status: 200 });
};