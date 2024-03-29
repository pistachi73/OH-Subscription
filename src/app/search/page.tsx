import { CardList } from "@/components/ui/cards/card-list";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

const SearchPage = () => {
  return (
    <MaxWidthWrapper className="grid grid-cols-2  gap-x-2 gap-y-14 py-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <CardList
        cardsPerRow={{
          "2xl": 6,
          xl: 5,
          lg: 4,
          sm: 3,
          xs: 2,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default SearchPage;
