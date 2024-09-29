import Link from "next/link";

export default function Home() {
    const items = [
      { id: 1, icon: '/images/rewards/food-drink-coffee-cup.png', label: 'Coffee' },
      { id: 2, icon: '/images/rewards/food-drink-hamburger.png', label: 'Burger' },
      { id: 3, icon: '/images/rewards/food-drink-desert-donut.png', label: 'Milk' },
      { id: 4, icon: '/images/rewards/food-drink-desert-cake-pond.png', label: 'Candy' },
      { id: 5, icon: '/images/rewards/food-drink-egg.png', label: 'Egg' },
      { id: 6, icon: '/images/rewards/food-drink-pizza.png', label: 'Pizza' },
    ];
  
    return (
        <div className="min-h-screen p-6 flex justify-center">
        <div className="">
          <div className="flex">
            <h1 className="flex text-center text-5xl font-bold mb-6 pt-32">
              <Link href="/roadmap">
                <img className="w-14 mr-4" src="/images/friends/back-button.svg" alt="Back button" />
              </Link>
              Award Board
            </h1>
          </div>

        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-64 h-64 flex items-center justify-center bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <span className="text-4xl">
                <img className="w-16" src={item.icon}></img>
              </span>
            </div>
          ))}
        </div>
     
        <div className="absolute bottom-0 w-full flex px-10 animate-moveIn">
            {/* <img  className="w-28 h-auto" src="/images/doggy.gif"></img> */}
            <img className="w-40 pt-10 animate-move-loop" src="/images/moving/rabbit_walking.gif"></img>
        </div>
          

         </div>
    </div>
    );
  }
  