import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur DocPilot</h1>
      <p className="text-gray-600 mb-8">Générez vos documents professionnels en quelques clics.</p>

      <SignedOut>
        <SignInButton>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Se connecter
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
        <a
          href="/dashboard/create"
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Créer un document
        </a>
      </SignedIn>
    </div>
  );
}
