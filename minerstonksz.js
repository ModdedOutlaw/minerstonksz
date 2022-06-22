async function fetchStonkszHoldersJSON() {
    const response = await fetch('https://wax.api.atomicassets.io/atomicassets/v1/accounts?template_id=516244&page=1&limit=100&order=desc');

    const holders = await response.json();

    return holders;

}

async function fetchStonkszDripJSON() {
    const response = await fetch('dripleaders.json');

    const dripleaders = await response.json();

    return dripleaders;

}


async function getHolders() {

    const dripWallet = {
        id: "",
        dripPerHour: 0
    };

    let main_wallet = Object.create(dripWallet);

    // 18d666be0c504b7a94b7478494e345dc
    await fetchStonkszDripJSON().then(stonksz_drip => {

        

        stonksz_drip.data.payload.forEach((element, index) => {
            if (element.minecraftUUID == '18d666be0c504b7a94b7478494e345dc') {

                main_wallet.name = element.minecraftUUID;

                main_wallet.dripPerHour = element.dripPerHour;

            }
     
        });

        console.log(main_wallet);

    });




    const holder = {
        name: "",
        miner_count: 0
    };

    let holderArray = [];
    let count = 0;


    await fetchStonkszHoldersJSON().then(stonksz_holders => {

        stonksz_holders.data.forEach((element, index) => {
            if (element.account != 'upliftminers') {

                const holder_temp = Object.create(holder);

                holder_temp.name = element.account;

                holder_temp.miner_count = element.assets;

                holderArray[count] = holder_temp;
                count += 1;
            }

        });
        console.log(holderArray);
    });

    let section = document.getElementsByClassName('outputMinerHolders');

    let totalOutput = document.createElement('tr');

    totalOutput.id = "totalDrip";

    totalOutput.innerHTML += '<td colspan = 2>TOTAL OUTPUT: '+main_wallet.dripPerHour.toFixed(0)+' <span id="drip-per">/hr</span></td>';

    section[0].appendChild(totalOutput);

    for (m = 0; m < holderArray.length; m++) {

        let player = document.createElement('tr');

        player.innerHTML += '<td>' + (m + 1) + '.</td><td><a id = "link-wallet" href="https://wax.atomichub.io/profile/' + holderArray[m].name + '?collection_name=upliftworld&order=desc&sort=transferred#inventory" target="_blank">' + holderArray[m].name + '</a></td> <td>' + holderArray[m].miner_count + '</td>';

        section[0].appendChild(player);
    }



}
getHolders();