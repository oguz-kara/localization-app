'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCreateTranslationKeyMutation } from '@/graphql/generated/hooks'

const createTranslationKeySchema = z.object({
  key: z.string()
    .min(1, 'Translation key is required')
    .max(200, 'Translation key must be less than 200 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Key must contain only letters, numbers, dots, underscores, and hyphens'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  context: z.string()
    .max(1000, 'Context must be less than 1000 characters')
    .optional(),
})

type CreateTranslationKeyForm = z.infer<typeof createTranslationKeySchema>

interface CreateTranslationKeyModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onSuccess?: (translationKey: any) => void
}

export function CreateTranslationKeyModal({ 
  isOpen, 
  onClose, 
  projectId,
  onSuccess 
}: CreateTranslationKeyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [createTranslationKey] = useCreateTranslationKeyMutation({
    onCompleted: (data) => {
      onSuccess?.(data.createTranslationKey)
      form.reset()
      onClose()
    },
    onError: (error) => {
      console.error('Failed to create translation key:', error)
      // Handle error - could show toast notification
    }
  })

  const form = useForm<CreateTranslationKeyForm>({
    resolver: zodResolver(createTranslationKeySchema),
    defaultValues: {
      key: '',
      description: '',
      context: '',
    },
  })

  const onSubmit = async (data: CreateTranslationKeyForm) => {
    setIsSubmitting(true)
    try {
      await createTranslationKey({
        variables: {
          input: {
            key: data.key,
            projectId,
            description: data.description || undefined,
            context: data.context || undefined,
          }
        }
      })
    } catch (error) {
      console.error('Error creating translation key:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Translation Key</DialogTitle>
          <DialogDescription>
            Add a new translation key to your project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation Key *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="buttons.submit"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this translation (e.g., buttons.submit, welcome.message)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Submit button text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of what this text is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional context for translators..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional context to help translators understand usage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}