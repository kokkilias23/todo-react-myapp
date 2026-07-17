const Footer = () => {
    const currentYear: number = new Date().getFullYear()

    return (
        <>
            <footer className="bg-cf-dark-gray text-black">
                <div className="container mx-auto py-8 text-center">
                    &copy; {currentYear} My Dream Box, created by Ilias Kokkalidis. All rights reserved.
                </div>
            </footer>
        </>
    )
}
export default Footer;
