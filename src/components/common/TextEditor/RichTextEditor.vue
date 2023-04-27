<template>
  <div>
    <ckeditor
      v-model="editorData"
      :editor="editor"
      :config="editorConfig"
      :class="`rich-text-editor ${size}`"
      @input="onInput"
    />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'RichTextEditor',
  props: {
    value: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'sm',
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        indent_style: 'tab',
        tab_width: 4,
        charset: 'utf-8',
        end_of_line: 'lf',
        trim_trailing_whitespace: true,
        insert_final_newline: true,
        shouldNotGroupWhenFull: true,
        toolbar: {
          items: [
            'heading', '|',
            'fontfamily', 'fontsize', '|',
            'alignment', '|',
            'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
            'outdent', 'indent', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'code', 'codeBlock', '|',
            'insertTable', '|',
            'blockQuote', '|',
            'undo', 'redo',
          ],
          shouldNotGroupWhenFull: true,
        },
      },
      editorData: this.value,
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.editorData = newValue
      },
      deep: true,
    },
  },
  methods: {
    onInput(editorData) {
      this.$emit('onInput', editorData)
    },
  },
}
</script>

<style lang="scss">
@import "@/assets/scss/global.scss";

.rich-text-editor {
  & + div {
    .ck-editor__editable {
      border: 1px solid $core-direction-base !important;
      border-radius: 0 0 10px 10px !important;
    }
    .ck-toolbar {
      border: 1px solid $core-direction-base !important;
      border-radius: 10px 10px 0px 0px !important;
    }
    .ck-toolbar__separator {
      background-color: $core-direction-base !important;
    }
  }
  &.sm {
    & + div {
      .ck-editor__editable {
        height: 250px !important;
      }
    }
  }

  &.md {
    & + div {
      .ck-editor__editable {
        height: 400px !important;
      }
    }
  }
}
</style>
