import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { Repository } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Page,
  PageBottomBar,
  PageContent,
  PageTopBar,
} from '@/components/Page';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { RepositoryForm } from '@/features/repositories/RepositoryForm';
import { useRepositoryCreate } from '@/features/repositories/service';

export default function PageRepositoryCreate() {
  const { t } = useTranslation(['common', 'repositories']);
  const navigate = useNavigate();

  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  const createRepository = useRepositoryCreate({
    onError: (error) => {
      if (error.status === 400) {
        const { title, errorKey } = error.body;
        toastError({
          title: t('repositories:create.feedbacks.updateError.title'),
          description: title,
        });
        if (errorKey === 'name_already_used') {
          form.setErrors({
            name: t('repositories:data.name.alreadyUsed'),
          });
        }
      }
    },
    onSuccess: () => {
      toastSuccess({
        title: t('repositories:create.feedbacks.updateSuccess.title'),
      });
      navigate('../');
    },
  });

  const form = useForm<Pick<Repository, 'name' | 'link' | 'description'>>({
    onValidSubmit: (newRepository) => {
      createRepository.mutate({ body: newRepository });
    },
  });

  return (
    <Page containerSize="md" isFocusMode>
      <Formiz connect={form}>
        <form noValidate onSubmit={form.submit}>
          <PageTopBar showBack onBack={() => navigate('/repositories')}>
            <Heading size="md">{t('repositories:create.title')}</Heading>
          </PageTopBar>
          <PageContent>
            <RepositoryForm />
          </PageContent>
          <PageBottomBar>
            <ButtonGroup justifyContent="space-between">
              <Button onClick={() => navigate('/repositories')}>
                {t('common:actions.cancel')}
              </Button>
              <Button
                type="submit"
                variant="@primary"
                isLoading={createRepository.isLoading}
              >
                {t('repositories:create.action.save')}
              </Button>
            </ButtonGroup>
          </PageBottomBar>
        </form>
      </Formiz>
    </Page>
  );
}
