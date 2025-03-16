<script lang="ts">
    // The data returned from load() is available as the "data" prop
    export let data: { pageData: any }; // Replace "any" with a proper type if available
    </script>
    <div>
    <h1>{data.pageData.title ? data.pageData.title : 'No title available'}</h1>
    <h3>{data.pageData.subtitle ? data.pageData.subtitle : 'No subtitle available'}</h3>

    <p>{data.pageData.content ? data.pageData.content : 'No content available'}</p>
    <pre>{JSON.stringify(data.pageData, null, 2)}</pre>
    </div>