import Image from 'next/image';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="Evently"
            width={128}
            height={38}
          />
        </Link>

        <div>
          <p>2024 Evently. Todos direitos reservados.</p>
          <p>Criado com ❤️ por João Lucas.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
