type Props = {
    dark?: boolean
}

const Footer = ({ dark = false }: Props) => {
    const currentYear: number = new Date().getFullYear()

    return (
        <>
            <footer className={`relative z-10 transition-colors duration-700 ${dark ? 'text-white/70' : 'text-black'}`}>
                <div className="container mx-auto py-8 text-center text-sm">
                    &copy; {currentYear} My Dream Box, created by Ilias Kokkalidis. All rights reserved.
                </div>
            </footer>
        </>
    )
}
export default Footer;
