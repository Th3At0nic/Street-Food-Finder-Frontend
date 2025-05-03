
export default function Footer() {

    return (
        <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} StreetBites. All rights reserved.
          </div>
        </div>
      </footer>
    );


}