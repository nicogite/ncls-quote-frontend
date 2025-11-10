declare module 'vue-quill' {
  import { DefineComponent } from 'vue'

  export const QuillEditor: DefineComponent<{
    content?: string
    'onUpdate:content'?: (value: string) => void
    theme?: string
    contentType?: string
  }>
}
