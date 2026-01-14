import PartClient from "./PartClient";

type PageProps = {
  params: {
    partId: string;
  };
};

export default function PartPage({ params }: PageProps) {
  return <PartClient partId={params.partId} />;
}
