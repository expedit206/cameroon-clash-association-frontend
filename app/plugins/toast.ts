import { reactive } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export default defineNuxtPlugin(() => {
  const toasts = reactive<Toast[]>([])
  let counter = 0

  const add = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = counter++
    toasts.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: number) => {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  return {
    provide: {
      toast: {
        toasts,
        add,
        remove,
        success: (msg: string) => add(msg, 'success'),
        error: (msg: string) => add(msg, 'error'),
        info: (msg: string) => add(msg, 'info'),
        warning: (msg: string) => add(msg, 'warning'),
      },
    },
  }
})
