<template>
    <VaButton @click="refreshPage" class="refresh-button">
        초기화
    </VaButton>

</template>

<script>
export default {
    name: 'RefreshButton',
    methods: {
        refreshPage() {
            // 페이지를 새로고침하는 함수
            window.location.reload();
        }
    }
}
</script>
