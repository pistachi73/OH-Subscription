import { BsArrowLeft } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormWrapperProps = {
  children: React.ReactNode;
  header: string;
  subHeader?: string | React.ReactNode;
  backButton?: boolean;
  backButtonOnClick?: () => void;
};

export const FormWrapper = ({
  children,
  header,
  subHeader,
  backButton,
  backButtonOnClick,
}: FormWrapperProps) => {
  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <div className="min-h-[20px]">
        {backButton && (
          <Button
            onClick={backButtonOnClick}
            size="inline"
            variant="link"
            className="text-sm text-muted-foreground hover:no-underline"
          >
            <BsArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        )}
      </div>
      <CardHeader className="px-0 py-6">
        <CardTitle className="text-3xl sm:text-2xl">{header}</CardTitle>
        <CardDescription className="mt-2 text-lg font-light sm:text-base">
          {subHeader}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-4">{children}</CardContent>
    </Card>
  );
};
