import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View, ViewProps } from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

type RankedRow = {
  rank: number;
  name: string;
  heuristic: string | number;
};

type PaginatedResponse = {
  data: RankedRow[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

type Props = ViewProps & {
  className?: string;
  heading: string;
  endpoint: string;         // base URL e.g. "https://api.example.com/rankings"
  pageSize?: number;        // passed as a query param, default 10
};

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: PaginatedResponse };

// ── Pagination controls ───────────────────────────────────────────────────────

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

function Pagination({ currentPage, totalPages, onPrev, onNext }: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast  = currentPage >= totalPages;

  return (
    <View className="flex-row items-center justify-between px-5 py-3 border-t border-gray-100">

      <Pressable
        onPress={onPrev}
        disabled={isFirst}
        className={`px-4 py-2 rounded-lg border ${
          isFirst
            ? "border-gray-100 bg-gray-50"
            : "border-gray-200 bg-white active:bg-gray-50"
        }`}
      >
        <Text className={`text-sm font-medium ${isFirst ? "text-gray-300" : "text-gray-700"}`}>
          ← Prev
        </Text>
      </Pressable>

      <Text className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={isLast}
        className={`px-4 py-2 rounded-lg border ${
          isLast
            ? "border-gray-100 bg-gray-50"
            : "border-gray-200 bg-white active:bg-gray-50"
        }`}
      >
        <Text className={`text-sm font-medium ${isLast ? "text-gray-300" : "text-gray-700"}`}>
          Next →
        </Text>
      </Pressable>

    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MetricCard({ className, heading, endpoint, pageSize = 10 }: Props) {
  const [page, setPage]   = useState(1);
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    setState({ status: "loading" });

    const url = `${endpoint}?page=${page}&pageSize=${pageSize}`;

    console.log(url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((payload: PaginatedResponse) => setState({ status: "success", payload }))
      .catch((err) => setState({ status: "error", message: err.message }));
  }, [endpoint, page]);

  // Reset to page 1 if endpoint changes
  useEffect(() => {
    setPage(1);
  }, [endpoint]);

  return (
    <View className={`${className} bg-white rounded-2xl border border-[#DAD0D0] overflow-hidden`}>

      {/* Heading */}
      <View className="px-5 py-4 border-b border-gray-100">
        <Text className="font-bold text-gray-900">{heading}</Text>
      </View>

      {/* Loading */}
      {state.status === "loading" && (
        <View className="py-10 items-center">
          <ActivityIndicator size="small" color="#6b7280" />
          <Text className="font-normal text-sm text-gray-400 mt-2">Loading...</Text>
        </View>
      )}

      {/* Error */}
      {state.status === "error" && (
        <View className="py-10 items-center px-5">
          <Text className="font-normal text-sm text-red-400 text-center">{state.message}</Text>
        </View>
      )}

      {/* Rows */}
      {state.status === "success" && (
        <>
          {/* Column headers */}
          <View className="flex-row px-5 py-2 bg-gray-50">
            <Text className="w-10 text-xs font-medium text-gray-400">#</Text>
            <Text className="flex-1 text-xs font-medium text-gray-400">Name</Text>
            <Text className="text-xs font-medium text-gray-400">Score</Text>
          </View>

          {state.payload.data.map((row, index) => (
            <View
              key={row.rank}
              className={`flex-row items-center px-5 py-3 ${
                index !== state.payload.data.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="w-10">
                <Text className="text-sm font-bold text-gray-400">{row.rank}</Text>
              </View>
              <Text className="flex-1 text-sm font-medium text-gray-800">{row.name}</Text>
              <Text className="text-sm text-gray-500">{row.heuristic}</Text>
            </View>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={state.payload.currentPage}
            totalPages={state.payload.totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(state.payload.totalPages, p + 1))}
          />
        </>
      )}

    </View>
  );
}