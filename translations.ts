export const translations = {
  en: {
    nav: {
      home: "Home",
      agriculture: "Agriculture",
      academy: "Academy",
      marketplace: "Marketplace",
      durePay: "Dure Pay",
      about: "About",
    },
    hero: {
      title: "Ethiopia's Digital Gateway",
      subtitle: "Jemaal Faanoo Haajii",
      bio: "DURE BORU Digital Research, Production, Sales, and Market Center",
      search: "Search agriculture, courses, products...",
      cta: "Start my page",
      browse: "Browse marketplace"
    },
    bottomNav: {
      home: "Home",
      shop: "Shop",
      club: "Club",
      earn: "Earn"
    },
    agriculture: {
      title: "Modern Agriculture",
      description: "Harnessing technology to revolutionize Ethiopian farming. From precision irrigation to high-yield sustainable seeds.",
      items: [
        { name: "Smart Irrigation Kit", desc: "Automated water management for maximum efficiency." },
        { name: "High-Yield Teff Seeds", desc: "Scientifically improved seeds for Ethiopian soil." },
        { name: "Solar Farming Hub", desc: "Renewable energy solutions for off-grid farms." }
      ]
    },
    academy: {
      title: "Digital Academy",
      description: "Empowering the next generation of Ethiopian tech leaders through world-class digital skills training.",
      apply: "Apply Now",
      courses: [
        { name: "Web Development", desc: "Master modern web technologies." },
        { name: "Agri-Tech Fundamentals", desc: "Learn to apply tech in farming." },
        { name: "Digital Marketing", desc: "Grow your business online." }
      ]
    },
    marketplace: {
      title: "Marketplace",
      subtitle: "Premium assets for the modern creator.",
      buy: "Buy Now",
      sortBy: "Sort By",
      newest: "Newest Arrivals",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      filterBy: "Filter by Category",
      categories: {
        all: "All Assets",
        agriculture: "Modern Agriculture",
        academy: "Digital Academy",
        software: "Software",
        general: "General",
        video: "Video & Animation",
        image: "Graphic Assets",
        templates: "Design Templates",
        documents: "Professional Documents",
        education: "Educational Materials",
      },
      adventure: {
        title: "Adventure & Tools",
        subtitle: "Explore powerful AI tools and learning resources.",
        share: "Share with Friends",
        invite: "Invite Others",
        like: "Like & Support",
        posted: "Posted by",
      },
      items: [
        { name: "Digital Business Planner", desc: "Organize your startup with our custom digital templates.", price: 2500, category: "Templates" },
        { name: "Agri-Drone Pro", desc: "Advanced drone for field monitoring and crop analysis.", price: 85000, category: "Modern Agriculture" },
        { name: "Yield Booster Fertilizer", desc: "Premium fertilizer to increase farm productivity (Xa'oo, Qoricha farra aramaa).", price: 1500, category: "Modern Agriculture" },
        { name: "Smart Tech Devices", desc: "Mobiles, computers, laptops, and tablets for modern farming and education.", price: 25000, category: "General" },
        { name: "Agricultural & Tech Books", desc: "Collection of books covering tech, farming, and digital academy topics.", price: 800, category: "Education" },
        { name: "Coffee Processing Masterclass", desc: "Expert guide on harvesting and processing Ethiopian coffee.", price: 4500, category: "Digital Academy" },
        { name: "Modern Farm Video Pack", desc: "High-quality drone footage of Ethiopian landscapes.", price: 1200, category: "Video" },
        { name: "Professional CV Template", desc: "ATS-friendly CV created with Google Docs.", price: 0, category: "Documents" },
        { name: "Educational Math Series", desc: "Complete mathematics curriculum for high schoolers.", price: 3000, category: "Education" },
        { name: "High-Res Agri Icons", desc: "Original icons for agriculture apps and websites.", price: 500, category: "Image" }
      ]
    },
    orders: {
      title: "My Orders",
      noOrders: "You haven't made any purchases yet.",
      viewProduct: "View Product",
      download: "Download Asset",
      status: "Status",
      date: "Date",
      notes: "Order Notes",
      notesPlaceholder: "Add special instructions...",
      cancelOrder: "Cancel Order",
      cancelSuccess: "Order cancellation requested successfully.",
      cancelConfirm: "Are you sure you want to cancel this order?",
      filterAll: "All Orders",
      filterProcessing: "Processing",
      filterShipped: "Shipped",
      filterDelivered: "Delivered",
      filterCancelled: "Cancelled",
      wishlist: {
        title: "My Wishlist",
        empty: "Your wishlist is empty.",
        moveToCart: "Move to Cart",
        remove: "Remove",
        added: "Added to wishlist!",
        removed: "Removed from wishlist.",
      },
      shippingDetails: {
        title: "Shipping Details",
        trackingNumber: "Tracking Number",
        carrier: "Carrier",
        estimatedDelivery: "Estimated Delivery",
      },
      rating: {
        title: "Rate Your Order",
        submit: "Submit Rating",
        success: "Thank you for your feedback!",
      },
      summary: {
        title: "Order Summary",
        details: "Detailed breakdown of your purchase",
        orderId: "Order ID",
        date: "Order Date",
        product: "Product",
        amount: "Total Amount",
        status: "Order Status",
        notes: "Special Instructions",
        privateNotes: "Private Notes",
        privateNotesPlaceholder: "Add or edit a private note for this order (saved to Firestore)...",
        saveNotes: "Save Private Notes",
        reorder: "Reorder Now",
        share: "Share Order",
        close: "Close Summary",
        filterDateStart: "Start Date",
        filterDateEnd: "End Date",
        allTime: "All Time",
        thisMonth: "This Month",
        last3Months: "Last 3 Months",
      },
      statusUpdate: {
        shipped: "Your order for {product} has been shipped!",
        delivered: "Your order for {product} has been delivered!",
      },
      profile: {
        title: "My Profile",
        uploadAvatar: "Upload Avatar",
        selectAvatar: "Select Avatar",
        saveChanges: "Save Changes",
        success: "Profile updated successfully!",
        error: "Error updating profile.",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        bio: "Bio / Description",
        uploadCustom: "Upload Custom Profile Picture",
        customPhotoUrl: "Or Custom Image URL",
        editProfile: "Edit Profile",
        viewProfile: "View Profile",
        saving: "Saving...",
      },
    },
    social: {
      title: "Community Social",
      subtitle: "Connect, share, and grow with the Dure Boru community.",
      postPlaceholder: "What's on your mind?",
      postButton: "Post Update",
      jemalPosts: "Content from Jemal Fano Haji",
      communityPosts: "Community Updates",
      like: "Like",
      comment: "Comment",
      share: "Share",
      shareSuccess: "Post link copied to clipboard!",
      noPosts: "No posts yet. Be the first to share!",
      connect: {
        title: "Connect with Us",
        telegram: "Telegram",
        facebook: "Facebook",
        instagram: "Instagram"
      }
    },
    features: {
      zero: "Free to start · No monthly fees",
      all: "Content Rewards · Instant Payouts · Book Sales"
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "Voices from the Dure Boru community.",
      items: [
        { 
          name: "Abebe Kebede", 
          role: "Modern Farmer", 
          text: "The Dure Boru smart irrigation kit changed my life. My yield increased by 40%." 
        },
        { 
          name: "Fatuma Hassan", 
          role: "Digital Student", 
          text: "Learning web development in the Digital Academy gave me the skills to open my own agency." 
        },
        { 
          name: "Derartu Tulu", 
          role: "Agri-Tech Graduate", 
          text: "The integration of traditional farming and modern tech is what Ethiopia needs." 
        }
      ]
    },
    newsletter: {
      title: "Stay Ahead of the Curve",
      subtitle: "Get the latest updates on Ethiopian agritech and digital development directly to your inbox.",
      placeholder: "Enter your email address",
      button: "Subscribe Now",
      success: "Thank you for subscribing!"
    },
    durePay: {
      title: "Dure Pay",
      subtitle: "Unified Gateway Simulation",
      balance: "Balance",
      send: "Send Money",
      pay: "Pay Bill",
      history: "Transaction History",
      simulate: "Simulate Payment",
      generateQR: "Generate QR Code",
      qrTitle: "Your Payment QR",
      qrDesc: "Scan this code to receive instant deposits or transfers.",
      merchant: "Merchant",
      date: "Date",
      status: "Status",
      amount: "Amount",
      success: "Success",
      failed: "Failed",
      exportCSV: "Export CSV",
      paymentMethods: {
        telebirr: "telebirr",
        cbe: "CBE Birr",
        wallet: "Dure Wallet"
      }
    }
  },
  om: {
    nav: {
      home: "Mana",
      agriculture: "Qonna",
      academy: "Akadaamii",
      marketplace: "Gabaa",
      durePay: "Dure Pay",
      about: "Waa'ee",
    },
    hero: {
      title: "Itoophiyaa Karaa Dijitaalaa",
      subtitle: "Jemaal Faanoo Haajii",
      bio: "Giddu-gala Omisha Qo'annaa fi Gurgurtaafi Gabaa digitaala DURE BORU",
      search: "Barbaadi qonna, barnoota, meeshaalee...",
      cta: "Start my page",
      browse: "Browse marketplace"
    },
    bottomNav: {
      home: "Mana",
      shop: "Gabaa",
      club: "Club",
      earn: "Earn"
    },
    agriculture: {
      title: "Qonna Ammayyaa",
      description: "Teeknooloojii fayyadamuun qonna Itoophiyaa jijjiiruuf. Bishaan obaasuu irraa kaasee hanga sanyii filatamaatti.",
      items: [
        { name: "Meeshaa Obaasuu Smart", desc: "Bulchiinsa bishaanii ofiisaa raawwatamu." },
        { name: "Sanyii Xaafii Filatamaa", desc: "Sanyii saayinsiidhaan fooyya'e." },
        { name: "Haba Maashina Aduu", desc: "Fayyadama annisaa aduu qonnaaf." }
      ]
    },
    academy: {
      title: "Akadaamii Dijitaalaa",
      description: "Dhaloota Itoophiyaa kan dandeettii dijitaalaa qaban leenjisuu.",
      apply: "Hirmaadhu",
      courses: [
        { name: "Web Development", desc: "Teeknooloojii web ammayyaa baradhu." },
        { name: "Bu'uura Agri-Tech", desc: "Akkaataa teeknooloojii qonna irratti itti fayyadaman baradhu." },
        { name: "Gabaa Dijitaalaa", desc: "Business keessan online irratti guddisaa." }
      ]
    },
    marketplace: {
      title: "Mana Gurgurtaa",
      subtitle: "Premium assets for the modern creator.",
      buy: "Amma Bitadhu",
      sortBy: "Akkaataa filannoo",
      newest: "Waan haaraa dhufe",
      priceLow: "Gatii: Gadii hanga Ol",
      priceHigh: "Gatii: Ol hanga Gadi",
      filterBy: "Akka ramaddiitti calali",
      categories: {
        all: "Hunda",
        agriculture: "Qonna Ammayyaa",
        academy: "Akadaamii Dijitaalaa",
        software: "Saaftuweerii",
        general: "Waliigala",
        video: "Viidiyoo fi Miidiyaa",
        image: "Fakkii fi Giraafiksii",
        templates: "Moodeloota Diizaayinii",
        documents: "Sanadoota Ogummaa",
        education: "Meeshaalee Barnootaa",
      },
      adventure: {
        title: "Adventure & Meeshaalee",
        subtitle: "Meeshaalee AI humna qaban fi ragaalee barumsaa daawwadhu.",
        share: "Hiriyootaaf hirun",
        invite: "Warra biraa afeeru",
        like: "Like & Deeggarsa",
        posted: "Kan maxxanfame",
      },
      items: [
        { name: "Karoorsituu Business Dijitaalaa", desc: "Startup keessan qindaawwaa dijitaalaatiin qindeessaa.", price: 2500, category: "Templates" },
        { name: "Agri-Drone Pro", desc: "Drone ammayyaa kan qonna hordofuuf gargaaru.", price: 85000, category: "Modern Agriculture" },
        { name: "Xa'oo fi Qoricha Farra Aramaa", desc: "Omishitummaa dabaluun fi qorichoota fkn Xa'oo, Qoricha farra argamaa kkf.", price: 1500, category: "Modern Agriculture" },
        { name: "Meeshaalee Teeknooloojii", desc: "Mobile, computer, laptop, tablets fi kkf gabaa irraa.", price: 25000, category: "General" },
        { name: "Kitaabota (Books)", desc: "Kitaabota adda addaa waa'ee qonna fi teeknooloojii.", price: 800, category: "Education" },
        { name: "Masterclass Qophii Bunaa", desc: "Akkaataa buna Itoophiyaa itti sassaabanii fi qopheessan.", price: 4500, category: "Digital Academy" },
        { name: "Viidiyoo Qonna Ammayyaa", desc: "Viidiyoo qulqullina qabu kan qonna Itoophiyaa agarsiisu.", price: 1200, category: "Video" },
        { name: "Moodela CV Ogummaa", desc: "CV bifa ammayyaatiin Google Docs irratti qophaa'e.", price: 0, category: "Documents" },
        { name: "Barnoota Herregaa", desc: "Barnoota herregaa guutuu barattoota kutaa 12f.", price: 3000, category: "Education" },
        { name: "Mallattoolee Qonnaa", desc: "Mallattoolee original kan apps fi websites qonnaaf ta'an.", price: 500, category: "Image" }
      ]
    },
    orders: {
      title: "Ajajawwan Koo",
      noOrders: "Hanga ammaatti waan bitattan hin qabdan.",
      viewProduct: "Oomisha Ilaali",
      download: "Asset Buufadhu",
      status: "Haala",
      date: "Guyyaa",
      notes: "Yaada Dabalataa",
      notesPlaceholder: "Yaada ykn qajeelfama addaa asitti barreessi...",
      cancelOrder: "Ajaja Haqi",
      cancelSuccess: "Ajajni akka haquuf gaaffiin milkaa'inaan dhiyaateera.",
      cancelConfirm: "Dhuguma ajaja kana haquu barbaaduu?",
      filterAll: "Ajajawwan Hunda",
      filterProcessing: "Hojiirra jira",
      filterShipped: "Ergameera",
      filterDelivered: "Geessifameera",
      filterCancelled: "Haqameera",
      wishlist: {
        title: "Kufaama Koo",
        empty: "Kufaamni keessan duwwaadha.",
        moveToCart: "Gara Gaariitti Dabarsi",
        remove: "Haqi",
        added: "Kufaamatti dabalameera!",
        removed: "Kufaama irraa haqameera.",
      },
      shippingDetails: {
        title: "Ragaalee Ergaa",
        trackingNumber: "Lakkoofsa Hordoffii",
        carrier: "Kampaanii Ergaa",
        estimatedDelivery: "Guyyaa Geessifamuuf Yaadame",
      },
      rating: {
        title: "Ajaja Keessan Mirkaneessaa",
        submit: "Rating Ergi",
        success: "Yaada keessaniif galatoomaa!",
      },
      summary: {
        title: "Cuunfaa Ajajaa",
        details: "Bal'ina bittaa keessanii",
        orderId: "Lakkoofsa Ajajaa",
        date: "Guyyaa Ajajaa",
        product: "Oomisha",
        amount: "Waliigala Gatii",
        status: "Haala Ajajaa",
        notes: "Yaada Dabalataa",
        privateNotes: "Yaada Dhuunfaa",
        privateNotesPlaceholder: "Yaada dhuunfaa ajaja kanaaf dabaladhu ykn fooyyessi (Firestore irratti ni olkoyama)...",
        saveNotes: "Yaada Dhuunfaa Olkaa'i",
        reorder: "Irra deebi'ii ajaji",
        share: "Ajaja Hiri",
        close: "Cuunfaa Cufi",
        filterDateStart: "Guyyaa Jalqabaa",
        filterDateEnd: "Guyyaa Dhumaa",
        allTime: "Hunda",
        thisMonth: "Ji'a Kana",
        last3Months: "Ji'oota 3n Darban",
      },
      statusUpdate: {
        shipped: "Ajajni keessan kan {product} ergameera!",
        delivered: "Ajajni keessan kan {product} geessifameera!",
      },
      profile: {
        title: "Piroofayilii Koo",
        uploadAvatar: "Avatar Ol Olchi",
        selectAvatar: "Avatar Filadhu",
        saveChanges: "Jijjiirama Olkaayi",
        success: "Piroofayiliin milkaa'inaan haaromeera!",
        error: "Piroofayilii haaromsuu irratti dogoggorri uumameera.",
        fullName: "Maqaa Guutuu",
        phoneNumber: "Lakkoofsa Bilbilaa",
        bio: "Bio / Ibsa",
        uploadCustom: "Suura Piroofayilii Ololchi",
        customPhotoUrl: "Yookaan URL Suuraa",
        editProfile: "Piroofayilii Gulaali",
        viewProfile: "Piroofayilii Ilaali",
        saving: "Haaromaa jira...",
      },
    },
    social: {
      title: "Hawaasummaa Hawaasaa",
      subtitle: "Hawaasa Dure Boruu waliin wal qunnamaa, hiradhaa, guddadhaa.",
      postPlaceholder: "Maaltu sammuu kee keessa jira?",
      postButton: "Maxxansi Haaromsa",
      jemalPosts: "Qabiyyee Jemaal Faanoo Haajii irraa",
      communityPosts: "Haaromsa Hawaasaa",
      like: "Like",
      comment: "Yaada",
      share: "Hiri",
      shareSuccess: "Geessituun maxxansaa gara gabatee garagalchaatti garagalfameera!",
      noPosts: "Maxxansi hin jiru. Jalqabaa ta'i hiradhu!",
      connect: {
        title: "Nu wajjin wal qunnamaa",
        telegram: "Telegram",
        facebook: "Facebook",
        instagram: "Instagram"
      }
    },
    features: {
      zero: "Free to start · No monthly fees",
      all: "Badhaasa Qabiyyee · Kaffaltii Ariifataa · Gurgurtaa Kitaabaa"
    },
    testimonials: {
      title: "Seenaa Milkaa'inaa",
      subtitle: "Sagalee hawaasa Dure Boruutiin humna argatan.",
      items: [
        { 
          name: "Abebe Kebede", 
          role: "Qonnaan Bulaa", 
          text: "Meeshaan obaasuu smart Dure Boruu jireenya koo jijjiireera. Omishni koo dhibbeentaa 40n dabaleera." 
        },
        { 
          name: "Faaxumaa Hasan", 
          role: "Barattuu Dijitaalaa", 
          text: "Akadaamii Dijitaalaa keessatti web development barachuun koo dandeettii agency koo ofii kootii banachuuf na gargaare." 
        },
        { 
          name: "Daraartuu Tulluu", 
          role: "Eebbifamtuu Agri-Tech", 
          text: "Walitti makiinsi qonna aadaa fi teeknooloojii ammayyaa Itoophiyaaf wanta barbaachisudha." 
        }
      ]
    },
    newsletter: {
      title: "Oduu Haaraa Hordofaa",
      subtitle: "Oduu qonnaa fi dijitaalaa Itoophiyaa yeroo yeroon argachuuf galmaa'aa.",
      placeholder: "Email keessan galchaa",
      button: "Subscribe Godhaa",
      success: "Galatoomaa galmaa'uu keessaniif!"
    },
    durePay: {
      title: "Dure Pay",
      subtitle: "Simulation Gateway Tokkummaa qabu",
      balance: "Hamma Maallaqaa",
      send: "Maallaqa Ergi",
      pay: "Kaffaltii Raawwadhu",
      history: "Seenaa Kaffaltii",
      simulate: "Kaffaltii Simulaat Gochuu",
      generateQR: "QR Code Hojiirra Olchi",
      qrTitle: "QR Kaffaltii Keessan",
      qrDesc: "Kaffaltii ykn dambalii argachuuf koodii kana skaan godhaa.",
      merchant: "Naggaadee",
      date: "Guyyaa",
      status: "Haala",
      amount: "Hamma",
      success: "Milkaa'e",
      failed: "Kufaaye",
      exportCSV: "CSV Galmeessi",
      paymentMethods: {
        telebirr: "telebirr",
        cbe: "CBE Birr",
        wallet: "Boorsaa Dure"
      }
    }
  }
};

export type Language = "en" | "om";
