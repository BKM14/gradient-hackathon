import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Text } from '@mantine/core';

const NavBar = () => {
    return (
        <nav className="bg-purple-100 shadow-md">
            <Container className="flex justify-between items-center py-4">
                <Text size="xl" weight={700} color="purple-800">
                    <Link to="/" className="no-underline text-purple-800 font-bold text-4xl">
                        Inclu-Edu
                    </Link>
                </Text>
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="text-purple-800 hover:underline">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="text-purple-800 hover:underline">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="text-purple-800 hover:underline">
                            Services
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="text-purple-800 hover:underline">
                            Contact
                        </Link>
                    </li>
                </ul>
            </Container>
        </nav>
    );
};

export default NavBar;