import Container from "@/components/Container";

export default function Home() {
  return (
    <Container className="flex flex-col items-center justify-center mt-28 md:mt-40 mb-12 text-center">
      <div className="bg-white max-w-fit mx-auto flex items-center justify-center space-x-2 py-2 px-7 mb-4 border border-gray-200 rounded-full shadow-md backdrop-blur overflow-hidden transition-all hover:bg-white/50 hover:border-gray-300">
        <p className="text-sm text-gray-700 font-semibold">
          Quill is now public
        </p>
      </div>
    </Container>
  );
}
