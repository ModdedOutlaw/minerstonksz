async function fetchPoolsJSON() {
    const response = await fetch('pools.json');
    const pools = await response.json();
    return pools;
}

async function fetchLowestPricedMinersJSON() {
    const response = await fetch('https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&collection_name=upliftworld&schema_name=miners&page=1&limit=50&order=desc&sort=template_id');
    const price = await response.json();

    return price;
}

async function getMinerDeals() {

    const miners = {
        name: "",
        rate: 0,
        id: 0,
        ratio: 0,
        price: 0,
        saleId: 0,
        img: 0,
        rarity: ""
    };

    let minerArray = [];
    let lowestPricedMinerArray = [];


    await fetchPoolsJSON().then(pools => {

        pools.data.payload.forEach((element, index) => {

            const miner = Object.create(miners);

            miner.name = element.label;
            miner.rate = parseFloat(element.size_per_tick_per_asset);
            miner.id = element.template_id;
            minerArray[index] = miner;

        });
    });

    await fetchLowestPricedMinersJSON().then(miner => {

        miner.data.forEach((e, i) => {

            let m = minerArray.find(o => o.id === e.assets[0].template.template_id);

            let ratio = m.rate / (e.price.amount / 100000000).toFixed(3);

            const lowMiner = Object.create(miners);
            lowMiner.name = e.assets[0].name;
            lowMiner.rate = parseFloat(m.rate).toFixed(2);
            lowMiner.id = e.assets[0].template.template_id;
            lowMiner.ratio = parseFloat(ratio).toFixed(2);
            lowMiner.price = parseFloat((e.price.amount / 100000000)).toFixed(2);
            lowMiner.saleId = e.sale_id;
            //console.log("img:  " + e.assets[0].data.img+ "  video:  " + e.assets[0].data.video);


            if (e.assets[0].data.img != undefined) {
                console.log("undefined");
                lowMiner.img = e.assets[0].data.img;
            } else {

                lowMiner.img = e.assets[0].data.video;
            }
            lowMiner.rarity = e.assets[0].data.rarity

            lowestPricedMinerArray[i] = lowMiner;

        });
        lowestPricedMinerArray.sort(function (a, b) {
            return b.ratio - a.ratio;
        });



    });



    let section = document.getElementsByClassName('miner-section');

    lowestPricedMinerArray.forEach(m => {



            let imageX = document.createElement('img');
            imageX.width = "135";
            imageX.height = "200";
            imageX.src = "img/" + m.img + ".jpg";

            section[0].appendChild(imageX);


        let descriptionX = document.createElement('p');
        descriptionX.innerHTML += '<h2>' + m.name + '</h2>' + m.ratio + ' upliftium per hour / price <br>' + m.rate + ' Upliftium per hour <br>' + m.price +
            ' wax<br><a href ="https://wax.atomichub.io/market/sale/' + m.saleId +
            '">AtomicHub</a><br><hr>';

        section[0].appendChild(descriptionX);

    });
    //console.log(section);


}