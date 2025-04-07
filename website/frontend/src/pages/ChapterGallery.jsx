import { useState, useMemo } from 'react';
import { Button, Group, Container, Paper, Text, Progress } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Utility function to split content by headings
function splitByHeadings(content) {
  // Split the content by '## ' but keep the delimiter
  const parts = content.split(/(?=## )/);
  // Filter out empty strings and trim each part
  return parts.filter(part => part.trim());
}

export default function ChapterGallery({ data }) {
  const contentPages = useMemo(() => {
    return splitByHeadings(data.content);
  }, [data.content]);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const totalSections = contentPages.length + 2; // hook + content pages + outro

  const goNext = () => {
    if (currentIndex < totalSections - 1) setCurrentIndex(currentIndex + 1);
  };

  const goBack = () => {
    if (currentIndex > -1) setCurrentIndex(currentIndex - 1);
  };

  const getContent = () => {
    if (currentIndex === -1) return data.hook;
    if (currentIndex === totalSections - 2) return data.outro;
    return contentPages[currentIndex];
  };

  return (
    <Container size="md" py="xl">
      <Text size="xl" fw={700} mb="lg" ta="center">
        {data.title}
      </Text>

      <Progress value={((currentIndex + 2) / totalSections) * 100} mb="md" />

      <Group justify="space-between" mt="xl" className='my-4'>
        <Button variant="light" onClick={goBack} disabled={currentIndex === -1}>
          Back
        </Button>

        {currentIndex === -1 ? (
          <Button onClick={goNext}>Start Reading</Button>
        ) : currentIndex < totalSections - 2 ? (
          <Button onClick={goNext}>Next</Button>
        ) : (
          <Button variant="outline" disabled>
            Finished
          </Button>
        )}
      </Group>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Paper shadow="md" p="lg" radius="md" withBorder>
            <ReactMarkdown>{getContent()}</ReactMarkdown>
          </Paper>
        </motion.div>
      </AnimatePresence>

      {currentIndex >= 0 && currentIndex < totalSections - 1 && (
        <Text size="sm" mt="md" ta="center">
          Page {currentIndex + 1} of {totalSections - 1}
        </Text>
      )}
    </Container>
  );
}
