async function fetchStonkszHoldersJSON() {
    const response = await fetch('https://wax.api.atomicassets.io/atomicassets/v1/accounts?template_id=516244&page=1&limit=100&order=desc');

      const holders = await response.json();

      return holders;
      
}


async function getHolders(){

    await fetchStonkszHoldersJSON().then(stonksz_holders => {

        stonksz_holders.data.forEach((element, index) => {
    
           console.log(element);
    
        });
    });

}
getHolders();
