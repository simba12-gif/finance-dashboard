import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
//When someone visits localhost:3000 they should land straight on the dashboard, not a blank page.