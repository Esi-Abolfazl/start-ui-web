import React from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  HStack,
  Heading,
  Img,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Trans, useTranslation } from 'react-i18next';
import { LuAlertCircle, LuBookOpen, LuGithub } from 'react-icons/lu';
import { RiStarSLine } from 'react-icons/ri';

import { Icon } from '@/components/Icons';
import { Page, PageContent } from '@/components/Page';

export default function PageDashboard() {
  const { t } = useTranslation(['dashboard']);

  const startUiWeb = useQuery<TODO>({
    queryKey: ['start-ui-web'],
    queryFn: () =>
      axios.get('https://api.github.com/repos/bearstudio/start-ui-web', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        },
      }),
    refetchInterval: 600000,
  });
  const startUiNative = useQuery<TODO>({
    queryKey: ['start-ui-native'],
    queryFn: () =>
      axios.get('https://api.github.com/repos/bearstudio/start-ui-native', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        },
      }),
    refetchInterval: 600000,
  });

  return (
    <Page containerSize="lg">
      <PageContent>
        <Heading size="md" mb="4">
          {t('dashboard:title')}
        </Heading>
        <Alert status="success" colorScheme="brand" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle fontSize="lg">
              {t('dashboard:welcome.title')}
            </AlertTitle>
            <AlertDescription display="block">
              {t('dashboard:welcome.description')}
              <br />
              <Text as="a" href="https://www.bearstudio.fr">
                <Trans t={t} i18nKey="dashboard:welcome.author" />
              </Text>
            </AlertDescription>
          </Box>
        </Alert>
        <Wrap mt="4" mb="6" spacing="4">
          <Button
            variant="link"
            as="a"
            href="https://github.com/BearStudio/start-ui"
          >
            <Icon icon={LuGithub} me="1" /> {t('dashboard:links.github')}
          </Button>
          <Button variant="link" as="a" href="https://docs.web.start-ui.com">
            <Icon icon={LuBookOpen} me="1" />{' '}
            {t('dashboard:links.documentation')}
          </Button>
          <Button
            variant="link"
            as="a"
            href="https://github.com/BearStudio/start-ui/issues/new"
          >
            <Icon icon={LuAlertCircle} me="1" />{' '}
            {t('dashboard:links.openIssue')}
          </Button>
        </Wrap>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6} flex={1}>
          <Stack
            bg="linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%);"
            py={4}
            borderRadius="md"
            flex={3}
            h="fit-content"
          >
            <HStack justifyContent="space-between" flex={1} px={8}>
              <Img src="/LogoBadgeWeb.png" />
              <Text fontSize="4xl" fontWeight="bold" color="white">
                {startUiWeb.data?.data?.stargazers_count}
                {startUiWeb.data && <Icon icon={RiStarSLine} />}
              </Text>
            </HStack>
            <Img src="/start-ui-web-qr-code.png" />
          </Stack>
          <Stack
            bg="linear-gradient(144.46deg, #7DD3FC 20.83%, #0EA5E9 82.5%);"
            py={4}
            borderRadius="md"
            flex={2}
            h="fit-content"
          >
            <HStack justifyContent="space-between" flex={1} px={8}>
              <Img src="/LogoBadgeNative.png" />
              <Text fontSize="4xl" fontWeight="bold" color="white">
                {startUiNative.data?.data?.stargazers_count}
                {startUiNative.data && <Icon icon={RiStarSLine} />}
              </Text>
            </HStack>
            <Img src="/start-ui-native-qr-code.png" />
          </Stack>
        </Stack>
      </PageContent>
    </Page>
  );
}
