import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Web3 from "web3";
import logo from "./logo.png";
import "./App.css";
// import { Web3Storage } from "web3.storage";
// JSON containing ABI and Bytecode of compiled smart contracts
import contractJson from "./artifacts/contracts/Binecone.sol/Binecone.json";

import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: '153a9634-fa72-4b7a-afbe-611ff728318f'
});
const index = pc.index('bc-index');


function App() {
  const [mmStatus, setMmStatus] = useState("Not connected!");
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState(undefined);
  const [displayMessage, setDisplayMessage] = useState("");
  const [web3, setWeb3] = useState(undefined);
  const [getNetwork, setGetNetwork] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [txnHash, setTxnHash] = useState(null);

  const tf = require('@tensorflow/tfjs');
  const words = 
  ['Mixes', 'Icy', 'BAGELS', 'Munchpack', 'Target', 'Sheep', 'Cleansers', 'Basket', 'Cypress', 'Favor', 'Giorno', 'NyQuil', 'Own', 'Loin', 'Elite', 'Rolling', 'Calabaza', 'Birch', 'Basmati', 'Toona', 'Soy', 'Graffiti', 'Pinapple', 'Vibrant', 'Cleasner', 'Tapatio', 'Slow', 'Load', 'Bazaar', 'Shui', 'Pomtastic', 'Peachtree', 'Fig', 'VanillaBean', 'sea', 'Rollhide', 'Ibuprofen', 'Vita', 'WellBars', 'Beat', 'Chesapeake', 'Lish', 'UltraGel', 'Duo', 'Cod', 'Louise', 'Frothed', 'Kamut', 'Skulls', 'Oh', 'Wall', 'Primary', 'Primadophilus', 'Porkless', 'Hothouse', 'Sq', 'Weight', 'A', 'Brush', 'Gobi', 'Teenage', 'Lactase', 'Recipe', 'Seriousmilk', 'Gefilte', 'Regenerist', 'Carbonator', 'Dolce', 'Portobello', 'pot', 'Frittata', 'Canola', 'Snacky', 'Carafe', 'Fage', 'Kind', 'Lorna', 'Deodorizing', 'Charentais', 'Shelf', 'Pastel', 'Tavern', 'Bialy', 'Complexion', 'Chakra', 'Crisp', 'Jus', 'Bolt', 'Sound', 'Ultiamte', 'Tequila', 'Tart', 'Insoles', 'Lime', 'Tandoor', 'Amazins', 'Powersmile', 'Cherimoya', 'Crazy', 'Kat', 'Sunshine', 'Carolina', 'Charmin', 'Learning', 'Groomer', 'Making', 'Brazilian', 'Crabless', 'Francisco', 'Ovulation', 'Dippin', 'Crest', 'Belly', 'Dinn', 'Splits', 'CalNaturale', 'Devils', 'Purity', 'Licorice', 'Himalania', 'Cookie', 'Pizzas', 'Barrel', 'Chik', 'Rewards', 'Insecticide', 'filled', 'Plain', 'Stevia', 'Gal', 'Cat', 'Mojitea', 'Walking', 'Seaside', 'Organics', 'Snacker', 'Sonoma', 'Ho', 'Deluxe', 'Zahidi', 'Boulliabaisse', 'Montana', 'Cleansing', 'Spelt', 'Petitie', 'Sportscap', 'Microbial', 'Moderate', 'Midol', 'Jalfrezi', 'Fluorite', 'VapoRub', 'Hydro', 'Lanolin', 'Burn', 'Gree', 'Noni', 'Fog', 'Brushing', 'Macrobar', 'Claritin', 'Dates', 'Totality', 'Montmorency', 'FreeWheat', 'Gucamole', 'Yrs', 'Punched', 'Feves', 'Combined', 'spray', 'Floors', 'Fondue', 'Paw', 'Perfect', 'Fumi', 'ML', 'Bockwurst', 'Locking', 'Colorsafe', 'Toenail', 'count', 'Sausages', 'Suppository', 'Biotrue', 'Postage', 'Twist', 'Funmallows', 'Carved', 'Multi', 'Douglas', 'Potayo', 'Topping', 'Filled', 'Fettuccini', 'Yuba', 'Gum', 'Twice', 'Brie', 'Maturity', 'Early', 'Margarine', 'Sc', 'Mult', 'Mon', 'Paws', 'Kandy', 'Canisters', 'Heartyhide', 'Only', 'Chilpotles', 'Wrappers', 'Chocolatta', 'B', 'Azur', 'Volpi', 'Breath', 'Traditionally', 'Ant', 'Creme', 'Fumigator', 'Eddy', 'Booyakasha', 'Mrs', 'Nose', 'Limes', 'Cracker', 'Foster', 'Diet', 'Grigio', 'Breakers', 'Chocolatey', 'Rotini', 'Jumbos', 'Nag', 'Cardamon', 'Jammin', 'Tams', 'Zyme', 'Coff', 'Sultana', 'for', 'Catfood', 'Marscapone', 'Jack', 'Dura', 'Cheer', 'Delux', 'Freeze', 'Supplment', 'REG', 'Crinkle', 'nut', 'Reset', 'Asado', 'Supernova', 'Chemical', 'Armagnac', 'Shoestrings', 'Skinner', 'Thigh', 'Cappucino', 'Contains', 'Grounding', 'Trace', 'Kukicha', 'Necks', 'Matilda', 'Containers', 'Heroes', 'Headbands', 'Teen', 'Quark', 'Boil', 'Clinging', 'MiniChunks', 'Pommegranate', 'Triangles', 'FL', 'Fresno', 'Di', 'Poptarts', 'Ecopouf', 'Ceylon', 'Stage', 'Panty', 'Guajillo', 'Stick', 'Square', 'Top', 'Length', 'Spongia', 'parmesan', 'Cruisers', 'Churros', 'nonfat', 'Manchurian', 'Glazed', 'Meringue', 'Detangle', 'Basic', 'FA', 'Bodcious', 'Masaman', 'SB', 'Wholesome', 'Lactose', 'Truffles', 'Lilac', 'Slap', 'Borax', 'Minneola', 'Riblets', 'Spiderman', 'Yourself', 'Pressels', 'Roarin', 'Enrobed', 'Outdoor', 'Carnaroli', 'Rome', 'Fave', 'Intense', 'CROSTINI', 'Doublewood', 'Weave', 'Cetrizine', 'Quinoa', 'chili', 'Kugel', 'Chang', 'Calms', 'Cutting', 'Lobelia', 'HRTH', 'Supply', 'Epsom', 'Reuse', 'Flo', 'Heart', 'Multigreen', 'Melanie', 'Hearts', 'Spit', 'Joyful', 'Share', 'EAT', 'Cordials', 'Hoisin', 'Multisurface', 'Blakes', 'Lemonade', 'Aceita', 'Salad', 'Candy', 'Sweeet', 'Relieving', 'CleanseMore', 'Oaxacan', 'Perspirant', 'Ciaculli', 'Pasta', 'Wisdom', 'Birthday', 'Refuse', 'Rabe', 'Supremely', 'XXXTra', 'Spaces', 'Table', 'RapidRelief', 'Restorative', 'Mediteranean', 'Antiperspirant', 'Boulardii', 'Curiosity', 'Chickenpeas', 'Korean', 'Manganese', 'Perfector', 'Powercore', 'Oxylent', 'Omegalicious', 'Ranchera', 'Opal', 'Bhutan', 'Profits', 'Purees', 'Gingered', 'Me', 'Phosphatidylserine', 'Prenatal', 'Opti', 'Budddy', 'DreamSticks', 'Pasty', 'Congestion', 'Crinkles', 'Egyptian', 'Tranquil', 'Pop', 'Dryers', 'Crawfish', 'Hacho', 'Cranberries', 'Cloud', 'Plantation', 'Chill', 'Fruitful', 'Kickin', 'Replenishment', 'Canes', 'Flavored', 'Nausea', 'Blackstrap', 'Art', 'Mediterranee', 'Genesis', 'Razors', 'Olivextra', 'Second', 'Watsonville', 'Stix', 'Smarte', 'potatoes', 'Ben', 'Dual', 'Lofhouse', 'Wj', 'Rejuveness', 'Carrier', 'Potates', 'Spanakopita', 'Texture', 'Brow', 'Fg', 'Picos', 'Digest', 'Man', 'Jar', 'Coat', 'South', 'Hulk', 'Moments', 'Cruchin', 'Welchs', 'Russet', 'Balance', 'Straight', 'Pearfecto', 'gelato', 'Infrared', 'Maker', 'Suddenly', 'BOdy', 'Radiant', 'Stracchino', 'Taboule', 'Hershey', 'Scotch', 'Calamine', 'Vienna', 'Nutritional', 'Dazzling', 'Blissfully', 'Viva', 'Smokies', 'fat', 'Dishwashing', 'Glasses', 'Krave', 'Citroen', 'Bromelain', 'ProActive', 'Mongolian', 'Tablecover', 'Raviolo', 'Herring', 'Reaching', 'Toast', 'Multimineral', 'Butterfly', 'Beastly', 'Lager', 'Fizz', 'Purified', 'Farmhand', 'ZZZQuil', 'Crd', 'Dos', 'Germ', 'Claret', 'Holy', 'Intervention', 'Deng', 'Color', 'Dawn', 'Leakguards', 'Rapid', 'Frizzy', 'Fussiness', 'ComfortCare', 'Charlie', 'Manzanilla', 'Choy', 'North', 'Valencia', 'Medleys', 'Campana', 'Turnovers', 'Flavorsplash', 'Crema', 'Fisher', 'Huge', 'Anitoxidant', 'Woolite', 'Amy', 'Ruled', 'Arame', 'Burbon', 'Somewhat', 'GoldBites', 'Gimme', 'Prilosec', 'Taffy', 'THAI', 'Roo', 'Essenses', 'Lapsang', 'Cocolicious', 'CK', 'Ruffled', 'Yams', 'Sweeping', 'Hachiya', 'Count', 'Intuition', 'Freedom', 'Bifido', 'Days', 'Rootbeer', 'Cranberrry', 'Giovanni', 'Pilsner', 'Tootsie', 'Saumon', 'Plant', 'UHT', 'Embrace', 'Atrisan', 'Prefilled', 'Roti', 'Domination', 'Pwer', 'Decker', 'Watercress', 'By', 'Powered', 'Jazzy', 'Lifesavors', 'Roni', 'Nerves', 'Technology', 'Delights', 'Accent', 'sunscreen', 'Watchers', 'Seat', 'Unsweetened', 'Mayer', 'Hit', 'Crunchy', 'Grana', 'Jalapenos', 'Sonicare', 'Palooza', 'Roll', 'Honey', 'Jellybeans', 'Bin', 'vitaminwater', 'Leave', 'Xtra', 'Alice', 'Zuma', 'Banana', 'Wellbites', 'Originali', 'Limu', 'Stelline', 'Virgin', 'Granulates', 'Uplifting', 'Fishies', 'SOLID', 'FastActives', 'Sunburst', 'Stars', 'Fino', 'Inversion', 'Twix', 'Mellow', 'Storm', 'Resistance', 'Redenbachers', 'Kabocha', 'Grnola', 'Curler', 'Jelled', 'Opadipity', 'Undone', 'Cubes', 'Sixty', 'Micellar', 'Adul', 'Peroxi', 'For', 'Shabbat', 'Duty', 'Add', 'Cherrios', 'Fos', 'Silken', 'UNstopables', 'Effervescents', 'Panic', 'Texturizing', 'Artisan', 'Bitter', 'BB', 'Ew', 'Spareribs', 'calorie', 'pads', 'X', 'Tradtional', 'Scum', 'Nu', 'Chefs', 'Vegit', 'Save', 'Tomatoes', 'Mushrooms', 'Brewers', 'Dote', 'Tartufo', 'Christmas', 'Adore', 'Demi', 'Belladonna', 'Prohibition', 'Open', 'SqueeZ', 'Cheeses', 'Pastina', 'Trall', 'LemonMint', 'Loam', 'Ume', 'Bunch', 'Fowl', 'Whispering', 'Buncha', 'Butterflake', 'Oily', 'Smmmile', 'Zero', 'Coupole', 'Tempting', 'Homeopathic', 'Kippers', 'Lapanzena', 'Vinegear', 'Jerky', 'Bounce', 'bread', 'I', 'Ultramix', 'Oxiclean', 'Cowlifornia', 'Cripps', 'Darn', 'Saccharomyces', 'Pastels', 'Snip', 'Remover', 'Konjac', 'Amarillas', 'Perfectio', 'Formula', 'Fritters', 'Colagate', 'Air', 'Duracell', 'Cave', 'Minty', 'Bison', 'Moisturizer', 'Orgeat', 'Cowabunga', 'Elbow', 'Berlin', 'dried', 'Cookkies', 'Peru', 'Condtitioner', 'Fish', 'Artichoke', 'Fred', 'Italia', 'VSOP', 'Zins', 'Oikios', 'Zealand', 'bars', 'Bristol', 'Buttermints', 'Moon', 'Bruschnettini', 'Actin', 'Through', 'Gulf', 'Sure', 'Phosphoricum', 'Ascent', 'Thinner', 'Nougat', 'Medallions', 'Silk', 'Mycommunity', 'Seabreeze', 'Wint', 'LunchMakers', 'Sour', 'Chanuka', 'Craft', 'Vsa', 'EverCreme', 'Coriander', 'GravyBones', 'Whitman', 'w', 'Rubbed', 'Picadillo', 'Devil', 'Rescue', 'Raisin', 'Central', 'Compactor', 'Luxe', 'Oranic', 'Enhancers', 'Enchiladas', 'Cascara', 'Camping', 'Idaho', 'Carbon', 'Lori', 'Cheezy', 'Corn', 'Hatch', 'Imperials', 'Yacon', 'Fruitfull', 'Mexicana', 'OriginalWhite', 'Solubilis', 'Enjoy', 'Vitacraves', 'Kritsa', 'Skillet', 'Rumplemint', 'Spiking', 'Oat', 'Omega', 'Softeners', 'Farmer', 'Carbonara', 'DairyPure', 'Slam', 'Quencher', 'Gochujang', 'Thickening', 'Aiolo', 'Muesli', 'Mlkshake', 'Crackle', 'Wars', 'Sorrenti', 'Starch', 'Tallulah', 'Va', 'Urinary', 'Ambrosia', 'Mutus', 'Brisk', 'Shoppe', 'Braided', 'Truffee', 'Salas', 'Dijonnaise', 'Fruitocracy', 'Trigger', 'Venus', 'Chaser', 'Oj', 'Chuito', 'Febreeze', 'En', 'Fmly', 'Pear', 'Ecolier', 'Robin', 'Alcaparrado', 'Gobble', 'Atomizer', 'Canned', 'Crystal', 'Desperado', 'Edensoy', 'Tondi', 'It', 'Cascade', 'Allergen', 'julienne', 'Praline', 'Threads', 'Bulbs', 'Regrowth', 'Plentiful', 'Puttanesca', 'Cerveza', 'Bee', 'Rasputin', 'Enlighten', 'Sections', 'Clear', 'Naturals', 'Chu', 'Crossovers', 'Forming', 'MOS', 'TOMATO', 'Bananaberry', 'Dough', 'Guaranteed', 'Stewed', 'or', 'Simple', 'Wontons', 'Restful', 'Perigod', 'Daiquiri', 'Medicine', 'Wht', 'Crackerbread', 'MUFFINS', 'Buttermilk', 'Macro', 'Frashmatic', 'Menudo', 'Tie', 'Strips', 'Bred', 'Colon', 'Dishsoap', 'Case', 'Cartridge', 'Sippy', 'Glow', 'Chicken', 'GFB', 'CoffeeCreamer', 'Luminosa', 'Super', 'Tumeric', 'Stronger', 'Magnesium', 'Floored', 'Tear', 'Continuous', 'Elastic', 'Villagio', 'Mimosa', 'Alaway', 'Intensely', 'Chrry', 'Zuchini', 'Jubilee', 'Krunchies', 'Book', 'Watermerlon', 'Igf', 'Chrome', 'Hard', 'Dustpan', 'Renewal', 'Chimichanga', 'more', 'Caracas', 'Evenly', 'Ice', 'Mpds', 'Ville', 'Braggberry', 'Whipped', 'Artifically', 'Duel', 'Chambord', 'Berbere', 'Seriously', 'Tortilla', 'Marionberry', 'Gose', 'Chddr', 'DuraTowel', 'Expeller', 'Italian', 'Piccante', 'Baked', 'Textured', 'Casing', 'Snack', 'Yummy', 'Seek', 'Shave', 'Rarebit', 'Fragrance', 'Prisoner', 'Twig', 'Virginia', 'Seal', 'Triumph', 'Cover', 'PlantForce', 'Spice', 'Bash', 'Rutherford', 'Panna', 'Medicated', 'Substitutes', 'Windex', 'Soa', 'Otg', 'Propolis', 'Chocotal', 'Croccantini', 'Hinged', 'Worcestershire', 'Delightfully', 'Refining', 'Cayenne', 'Dialblo', 'Cluckin', 'non', 'Xvoo', 'Process', 'Peets', 'Claming', 'Flip', 'UNSWEETENED', 'Postnatal', 'Easter', 'Roasting', 'Oaxaca', 'Milkshake', 'Wipe', 'Lindcove', 'Cf', 'Mixtures', 'Clotted', 'Soft', 'Right', 'Korn', 'Emperor', 'Oelek', 'Ear', 'Pumice', 'Disc', 'Pantiliners', 'Roasts', 'Ester', 'Bayley', 'Cabernet', 'Santitas', 'Washers', 'Funyuns', 'Pineapple', 'Relationship', 'Muffins', 'Lips', 'Orangeade', 'Moscato', 'Cola', 'Dropper', 'Yolk', 'Magnum', 'ups', 'Confectioners', 'Donettes']
  ;

  useEffect(() => {
    (async () => {
      // Define web3
      const web3 = new Web3(window.ethereum);

      if (window.ethereum) {
        try {
          await window.ethereum.enable();
        } catch (error) {
          console.log("Error: User account error.", error);
        }
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log("Error: No wallet detected. Please install Metamask.");
      }

      setWeb3(web3);
      // get networkId
      const networkId = await web3.eth.getChainId();
      setGetNetwork(networkId);
      // INSERT deployed smart contract address
      const contract = "0xeA35767250a94B22aB54a3D9f9b04F3A28FBd939";
      setContractAddress(contract);
      // Instantiate smart contract instance
      const Binecone = new web3.eth.Contract(contractJson.abi, contract);
      setContracts(Binecone);
      // Set provider
      Binecone.setProvider(window.ethereum);
    })();
  }, []);

  // Connect to Metamask wallet
  async function connectWallet() {
    // Check Metamask status
    if (window.ethereum) {
      setMmStatus("✅ Metamask detected!");
      try {
        // Metamask popup will appear to connect the account
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Get address of the account
        setAccountAddress(accounts[0]);
        setIsConnected(!isConnected);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else {
      setMmStatus("⚠️ No wallet detected! Please install Metamask.");
    }
  }

  // Read message from smart contract
  async function receive() {
    // Display message
    // var displayMessage = await contracts.methods.read().call();
    // setDisplayMessage(displayMessage);
    var getMessage = document.getElementById("message").value;

    const wordIndices = words.reduce((acc, word, index) => {
      acc[word] = index;
      return acc;
    }, {});

    const embeddingLayer = tf.layers.embedding({
      inputDim: words.length,
      outputDim: 4,
    });
    
    const messageIndex = tf.tensor1d([wordIndices[getMessage]], 'int32');
    const messageEmbedding = embeddingLayer.apply(messageIndex);

    const embeddingArray = messageEmbedding.arraySync();
    

    const queryResponse = await index.namespace('ns1').query({
      topK: 2,
      id: getMessage,
    });

    const queryJson = JSON.stringify(queryResponse);

    // var displayMessage = await index.namespace('ns1').query({
    //   topK: 2,
    //   vector: [0.00659030769, -0.0223639067, 0.0147436913, 0.0449554063, -0.0190351103, -0.0202379841, -0.0215382986, 0.0194707103, 0.0415082797, -0.0443089567],
    // });

    setDisplayMessage(queryJson);

  }

  // Write message to smart contract
  async function send() {
    // Get input value of message
    var getMessage = document.getElementById("message").value;
    setLoading(true);
    setDisplayMessage();

    const wordIndices = words.reduce((acc, word, index) => {
      acc[word] = index;
      return acc;
    }, {});

    const embeddingLayer = tf.layers.embedding({
      inputDim: words.length,
      outputDim: 4,
    });
    
    const messageIndex = tf.tensor1d([wordIndices[getMessage]], 'int32');
    const messageEmbedding = embeddingLayer.apply(messageIndex);


    const embeddingArray = messageEmbedding.arraySync();

    const output = {
      id: getMessage,
      values: embeddingArray[0]
    };

    const outputJson = JSON.stringify(output);

    console.log(outputJson);
    
    // Send message to smart contract
    await contracts.methods
      .write(outputJson)
      .send({ from: accountAddress })
      .on("transactionHash", function (hash) {
        setTxnHash(hash);
      });
    setLoading(false);

    await index.namespace('ns1').upsert([
      output,
    ]);

    setDisplayMessage(outputJson);
  }

  return (
    <div className="App">
      {/* Metamask status */}
      <div className="text-center">
        {getNetwork != "3141"
          ? "Filecoin FVM Calibration network."
          : mmStatus}
      </div>
      <hr />
      <h1 className="text-center text-4xl font-bold mt-8">
      🍃 Binecone 🌿
      </h1>
      {/* Connect to Metamask */}
      <center>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-8 mb-6"
          onClick={connectWallet}
        >
          Connect wallet
        </button>
      </center>
      {/* Show account address */}
      <div className="text-center text-sm">{accountAddress}</div>
      {/* Send message */}
      <center className="mt-12">
        <input
          type={"text"}
          placeholder={"Input data"}
          id="message"
          className="w-60 bg-white rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-white focus:border-indigo-500 text-base outline-none text-gray-700 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
        <button
          className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-3"
          onClick={isConnected && send}
        >
          Store
        </button>
        {/* Receive message */}
        <button
          className="text-center  bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-3"
          onClick={isConnected && receive}
        >
          Search
        </button>
      </center>
      <p className="text-center text-sm mt-6">
        {loading == true ? (
          <>
            Upserting data to Vector database...
            <p className="mt-4 text-xs ">
              Txn hash:{" "}
              <a
                className="text-blue-500"
                href={"https://calibration.filfox.info/en/tx/" + txnHash}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txnHash}
              </a>
            </p>
            <p className="mt-2 text-xs">
              Please wait till the transaction is completed...
            </p>
          </>
        ) : (
          ""
        )}
      </p>
      {/* Display message */}
      <div className="text-center text-xl mt-4">
        <b>{displayMessage}</b>
      </div>
      
      {/* Footer FVM content */}
      <footer className="footer">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p className="mt-4 text-xs sm:text-sm text-black">
          Learn more about Binecone {""}
          <a
            className="text-blue-500 no-underline hover:underline hover:text-blue-400"
            href="https://binecone.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
