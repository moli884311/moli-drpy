<script setup>
import { ref, computed, onMounted } from 'vue'
import { fileApi } from '../api/file'
import { adminApi } from '../api/admin'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const loading = ref(false)
const saving = ref(false)
const customData = ref({ sites: [], lives: [] })
const brandName = ref('')

const CUSTOM_JSON_PATH = 'public/sub/custom/moli.json'

const editingSection = ref(null)
const editContent = ref('')
const editOriginal = ref('')

const isDarkMode = computed(() => themeStore.isDark)

onMounted(async () => {
  await loadCustomData()
  try {
    const cfg = await adminApi.getConfig('brand_name')
    brandName.value = cfg?.data?.value || '沫离影视'
  } catch { brandName.value = '沫离影视' }
})

const loadCustomData = async () => {
  loading.value = true
  try {
    const fileResult = await fileApi.readFile(CUSTOM_JSON_PATH)
    let raw = ''
    if (fileResult?.content) {
      raw = fileResult.content
    } else if (typeof fileResult === 'string') {
      raw = fileResult
    }
    const parsed = JSON.parse(raw)
    customData.value = {
      sites: parsed.sites || [],
      lives: parsed.lives || []
    }
  } catch (e) {
    console.error('Load custom sources error:', e)
    customData.value = { sites: [], lives: [] }
  } finally {
    loading.value = false
  }
}

const fullJson = computed(() => {
  return JSON.stringify(customData.value, null, 2)
})

const startEdit = (section) => {
  editingSection.value = section
  const data = customData.value[section]
  editContent.value = JSON.stringify(data, null, 2)
  editOriginal.value = editContent.value
}

const cancelEdit = () => {
  editingSection.value = null
  editContent.value = ''
  editOriginal.value = ''
}

const hasChanges = computed(() => editContent.value !== editOriginal.value)

const saveEdit = async () => {
  if (editingSection.value === null) return
  saving.value = true
  try {
    const parsed = JSON.parse(editContent.value)
    customData.value[editingSection.value] = parsed
    await fileApi.writeFile(CUSTOM_JSON_PATH, fullJson.value)
    editOriginal.value = editContent.value
    editingSection.value = null
    editContent.value = ''
  } catch (e) {
    alert('保存失败: ' + (e.message || 'JSON 格式错误'))
  } finally {
    saving.value = false
  }
}

const typeLabels = {
  1: '源', 2: '源',
  3: 'DR2', 4: 'DS', 5: 'CatVod',
}

const typeColors = {
  1: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  2: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  3: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  4: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  5: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const siteTypeMap = {
  3: 'JS (DR2)', 4: 'JS (DS) / HIPY', 5: 'PHP / CatVod',
}

const sitesCount = computed(() => customData.value.sites?.length || 0)
const livesCount = computed(() => customData.value.lives?.length || 0)

const displayName = (name) => {
  if (!name || !brandName.value) return name
  return name.replace(/\{brand_name\}/g, brandName.value)
}
</script>

<template>
  <div class="custom-source-page">
    <div class="custom-source-header">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold">自定义源管理</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            自动检测 {{ CUSTOM_JSON_PATH }}，分别管理站点和直播源
          </p>
        </div>
        <button @click="loadCustomData" :disabled="loading" class="btn btn-secondary">
          <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新检测
        </button>
      </div>
    </div>

    <div class="custom-source-content space-y-6 mt-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ sitesCount }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">站源数量</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ livesCount }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">直播源数量</p>
        </div>
      </div>

      <!-- === 站源源文件 === -->
      <section>
        <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          站源源文件 (sites)
        </h3>

        <div v-if="editingSection === 'sites'" class="card border-2 border-blue-300 dark:border-blue-700">
          <div class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">正在编辑 sites 数组</span>
            <div class="flex gap-2">
              <button @click="cancelEdit" class="btn btn-secondary text-xs px-3 py-1">取消</button>
              <button @click="saveEdit" :disabled="saving || !hasChanges" class="btn btn-primary text-xs px-3 py-1">
                <svg v-if="saving" class="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                保存
              </button>
            </div>
          </div>
          <div class="h-[400px]">
            <vue-monaco-editor
              v-model:value="editContent"
              language="json"
              :theme="isDarkMode ? 'vs-dark' : 'vs'"
              :options="{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                tabSize: 2
              }"
              height="100%"
            />
          </div>
        </div>

        <div v-else class="card p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-gray-100">sites 数组</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">共 {{ sitesCount }} 个站点 · drpy-node/{{ CUSTOM_JSON_PATH }}</p>
            </div>
          </div>
          <button @click="startEdit('sites')" class="btn btn-secondary text-sm">
            编辑
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="sitesCount === 0" class="card p-6 text-center text-gray-500 dark:text-gray-400">
          暂无站点，点击上方「编辑」手动添加或通过「源管理」页面导入
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          <div
            v-for="site in customData.sites"
            :key="site.key"
            class="card p-3 hover:shadow-md transition-shadow border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
          >
            <div class="flex items-start gap-3">
              <span class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0" :class="typeColors[site.type] || typeColors[1]">
                {{ typeLabels[site.type] || '源' }}
              </span>
              <div class="min-w-0 flex-1">
                <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate" :title="displayName(site.name)">{{ displayName(site.name) }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate" :title="site.key">{{ site.key }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ siteTypeMap[site.type] || '未知类型' }}</p>
                <div class="flex flex-wrap gap-1 mt-1.5">
                  <span v-if="site.searchable" class="px-1.5 py-0.5 text-xs rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">可搜索</span>
                  <span v-if="site.filterable" class="px-1.5 py-0.5 text-xs rounded bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">可筛选</span>
                  <span v-if="site.quickSearch" class="px-1.5 py-0.5 text-xs rounded bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">快搜</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- === 直播源源文件 === -->
      <section>
        <h3 class="text-lg font-medium mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553 2.276A1 1 0 0121 13.382V18.62a1 1 0 01-.447.894L15 21m0-11V4m0 0L9 3m6 1L9 3m0 0l-5.447 2.724A1 1 0 003 6.618V11.38a1 1 0 00.447.894L9 15m0-12v12" />
          </svg>
          直播源源文件 (lives)
        </h3>

        <div v-if="editingSection === 'lives'" class="card border-2 border-green-300 dark:border-green-700">
          <div class="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-300">正在编辑 lives 数组</span>
            <div class="flex gap-2">
              <button @click="cancelEdit" class="btn btn-secondary text-xs px-3 py-1">取消</button>
              <button @click="saveEdit" :disabled="saving || !hasChanges" class="btn btn-primary text-xs px-3 py-1">
                <svg v-if="saving" class="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                保存
              </button>
            </div>
          </div>
          <div class="h-[400px]">
            <vue-monaco-editor
              v-model:value="editContent"
              language="json"
              :theme="isDarkMode ? 'vs-dark' : 'vs'"
              :options="{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                tabSize: 2
              }"
              height="100%"
            />
          </div>
        </div>

        <div v-else class="card p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-gray-100">lives 数组</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">共 {{ livesCount }} 个直播源 · drpy-node/{{ CUSTOM_JSON_PATH }}</p>
            </div>
          </div>
          <button @click="startEdit('lives')" class="btn btn-secondary text-sm">
            编辑
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-6">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="livesCount === 0" class="card p-6 text-center text-gray-500 dark:text-gray-400">
          暂无直播源，点击上方「编辑」手动添加
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          <div
            v-for="live in customData.lives"
            :key="live.name"
            class="card p-3 hover:shadow-md transition-shadow border border-transparent hover:border-green-200 dark:hover:border-green-800"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553 2.276A1 1 0 0121 13.382V18.62a1 1 0 01-.447.894L15 21m0-11V4m0 0L9 3m6 1L9 3m0 0l-5.447 2.724A1 1 0 003 6.618V11.38a1 1 0 00.447.894L9 15m0-12v12" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{{ displayName(live.name) }}</h4>
                <p v-if="live.url" class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ live.url }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.custom-source-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 8rem - 4rem);
  min-height: 500px;
}

.custom-source-header {
  flex-shrink: 0;
  padding-bottom: 1rem;
}

.custom-source-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>
