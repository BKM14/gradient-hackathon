import { useState, useMemo } from 'react';
import { Button, Group, Container, Paper, Text, Progress, Image } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Utility function to split content by headings and interleave images
function splitByHeadings(content, images) {
  // Split the content by '## ' but keep the delimiter
  const parts = content.split(/(?=##)/).filter(part => part.trim());
  
  // Interleave images with content
  const interleaved = [];
  parts.forEach((part, index) => {
    interleaved.push(part);
    if (images && images[index]) { // Ensure images is defined and has elements
      interleaved.push({ type: 'image', src: images[index] });
    }
  });

  return interleaved;
}

export default function ChapterGallery({ article, images }) {
  if (!article) return (
    <Container className="min-h-screen flex items-center justify-center">
      <Text color="red">Article not found</Text>
    </Container>
  );

  const contentPages = useMemo(() => {
    return article?.content ? splitByHeadings(article.content, images) : [];
  }, [article?.content, images]);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const totalSections = contentPages.length + 2; // hook + content pages + outro

  const goNext = () => {
    if (currentIndex < totalSections - 1) setCurrentIndex(currentIndex + 1);
  };

  const goBack = () => {
    if (currentIndex > -1) setCurrentIndex(currentIndex - 1);
  };

  const getContent = () => {
    if (currentIndex === -1) return article.hook;
    if (currentIndex === totalSections - 2) return article.outro;

    const page = contentPages[currentIndex];
    if (typeof page === 'string') {
      return <ReactMarkdown>{page}</ReactMarkdown>;
    } else if (page.type === 'image') {
      return <Image src={page.src} alt={`${article.title} - Image`} height={200} fit="contain" className="rounded shadow" />;
    }
  };

  return (
    <Container size="md" py="xl">
      <Text size="xl" fw={700} mb="lg" ta="center">
        {article.title}
      </Text>

      <Progress value={((currentIndex + 1) / (totalSections - 1)) * 100} mb="md" />

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
            {getContent()}
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
