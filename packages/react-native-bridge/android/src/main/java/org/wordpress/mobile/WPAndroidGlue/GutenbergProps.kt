package org.wordpress.mobile.WPAndroidGlue

import android.os.Bundle

data class GutenbergProps @JvmOverloads constructor(
    val enableMentions: Boolean,
    val enableUnsupportedBlockEditor: Boolean,
    val localeSlug: String,
    val postType: String,
    val editorTheme: Bundle?,
    val translations: Bundle,
    val isDarkMode: Boolean,
    val htmlModeEnabled: Boolean,
    val isModalLayoutPickerEnabled: Boolean = false
) {

    fun getInitialProps(bundle: Bundle?) = (bundle ?: Bundle()).apply {
        putString(PROP_INITIAL_DATA, "")
        putString(PROP_INITIAL_TITLE, "")
        putString(PROP_LOCALE, localeSlug)
        putString(PROP_POST_TYPE, postType)
        putBundle(PROP_TRANSLATIONS, translations)
        putBoolean(PROP_INITIAL_HTML_MODE_ENABLED, htmlModeEnabled)

        putBundle(PROP_CAPABILITIES, Bundle().apply {
            putBoolean(PROP_CAPABILITIES_MENTIONS, enableMentions)
            putBoolean(PROP_CAPABILITIES_UNSUPPORTED_BLOCK_EDITOR, enableUnsupportedBlockEditor)
            putBoolean(PROP_CAPABILITIES_MODAL_LAYOUT_PICKER, isModalLayoutPickerEnabled)
        })

        editorTheme?.also {
            getSerializable(PROP_COLORS)?.let { putSerializable(PROP_COLORS, it) }
            getSerializable(PROP_GRADIENTS)?.let { putSerializable(PROP_GRADIENTS, it) }
        }
    }

    companion object {

        fun initContent(bundle: Bundle?, title: String?, content: String?) =
                (bundle ?: Bundle()).apply {
                    title?.let { putString(PROP_INITIAL_TITLE, it) }
                    content?.let { putString(PROP_INITIAL_DATA, it) }
                }

        private const val PROP_INITIAL_DATA = "initialData"
        private const val PROP_INITIAL_TITLE = "initialTitle"
        private const val PROP_INITIAL_HTML_MODE_ENABLED = "initialHtmlModeEnabled"
        private const val PROP_POST_TYPE = "postType"
        private const val PROP_LOCALE = "locale"
        private const val PROP_TRANSLATIONS = "translations"
        private const val PROP_COLORS = "colors"
        private const val PROP_GRADIENTS = "gradients"

        const val PROP_CAPABILITIES = "capabilities"
        const val PROP_CAPABILITIES_MENTIONS = "mentions"
        const val PROP_CAPABILITIES_UNSUPPORTED_BLOCK_EDITOR = "unsupportedBlockEditor"
        const val PROP_CAPABILITIES_MODAL_LAYOUT_PICKER = "modalLayoutPicker"
    }
}
