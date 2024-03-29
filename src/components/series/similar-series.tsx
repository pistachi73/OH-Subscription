import { CardList } from "../ui/cards/card-list";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";

export const SimilarSeries = () => {
  return (
    <div className=" mx-auto my-8 w-full max-w-[1600px] sm:my-12">
      <h2 className="text-xl font-semibold">You might also like</h2>

      <div className="grid grid-cols-2  gap-x-2 gap-y-4 py-4 sm:grid-cols-3 lg:grid-cols-4">
        <CardList
          totalCards={8}
          cardsPerRow={{
            sm: 2,
            md: 3,
            lg: 4,
          }}
        />
      </div>
    </div>
  );
};
