import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1 container mt-4">{children}</main>
                <Footer />
            </body>
        </html>
    );
};

export default RootLayout;
