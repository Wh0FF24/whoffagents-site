import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  email: string;
  name: string;
  subscribedAt: string;
  source: string;
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Read existing subscribers
    const subscribers = await readSubscribers();

    // Check for duplicate
    if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { message: "Already subscribed", alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Add new subscriber
    const newSubscriber: Subscriber = {
      email: email.trim().toLowerCase(),
      name: (name || "").trim(),
      subscribedAt: new Date().toISOString(),
      source: source || "website",
    };

    subscribers.push(newSubscriber);
    await writeSubscribers(subscribers);

    return NextResponse.json(
      {
        message: "Subscribed successfully",
        subscriber: {
          email: newSubscriber.email,
          name: newSubscriber.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await readSubscribers();
    return NextResponse.json({
      count: subscribers.length,
    });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
