import { Loader } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

type Props = {
	isLoading?: boolean;
	isEmpty?: boolean;
	emptyMessage?: string;
};

const FlatListEmptyLoader = ({
	isLoading = false,
	isEmpty = false,
	emptyMessage = "No transactions found",
}: Props) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-[300px]">
				<Loader className="h-6 w-6 animate-spin mr-2" />
				<span className="text-sm text-muted-foreground">Loading...</span>
			</div>
		);
	}

	if (isEmpty) {
		return <EmptyState title={emptyMessage} description="" />;
	}

	return null;
};

export default FlatListEmptyLoader;
