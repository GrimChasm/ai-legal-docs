/**
 * Test route to verify print route is accessible
 * Route: /documents/[id]/print/test
 */

import { notFound } from "next/navigation"
import { auth } from "@/lib/auth-helper"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PrintTestPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    notFound()
  }

  return (
    <div className="paper" style={{ padding: "2rem" }}>
      <h1>Print Route Test</h1>
      <p>If you can see this, the route group is working correctly.</p>
      <p>Draft ID: {id}</p>
      <p>User ID: {session.user.id}</p>
      <p>This page should NOT have header or footer.</p>
    </div>
  )
}

