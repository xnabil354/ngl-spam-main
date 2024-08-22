import NglSpamForm from '../components/NglSpamForm';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-500 to-orange-500 text-gray-900 min-h-screen flex flex-col items-center justify-center">
      <main className="w-full max-w-2xl p-4">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-white tracking-wide drop-shadow-md">
          Spam Ngl-Link
        </h1>
        <NglSpamForm />
      </main>
    </div>
  );
}
