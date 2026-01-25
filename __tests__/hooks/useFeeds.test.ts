import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useFeeds, useCreateFeed } from "../../hooks/queries/useFeeds";

const { listFeeds, createFeed } = vi.hoisted(() => ({
  listFeeds: vi.fn(),
  createFeed: vi.fn(),
}));

vi.mock("../../convex/_generated/api", () => ({
  api: {
    feeds: {
      listFeeds,
      createFeed,
    },
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryFn }: any) => {
    queryFn();
    return { isSuccess: true };
  },
  useMutation: (opts: any) => ({
    mutateAsync: (vars: any) => opts.mutationFn(vars),
  }),
  useQueryClient: () => ({
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  }),
}));

describe("Feed Hooks", () => {
  const mockBabyId = "mock-baby-id";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useFeeds", () => {
    it("should fetch feeds for a given baby", async () => {
      const mockFeeds = [
        {
          _id: "feed-1" as any,
          _creationTime: Date.now(),
          babyId: mockBabyId,
          type: "breast",
          startTime: Date.now() - 3600000,
          createdById: "user-1" as any,
        },
      ];

      listFeeds.mockResolvedValue(mockFeeds);

      const { result } = renderHook(() => useFeeds(mockBabyId));

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(listFeeds).toHaveBeenCalledWith({
        babyId: mockBabyId,
      });
    });

    it("should accept date range filter", async () => {
      const startDate = Date.now() - 86400000;
      const endDate = Date.now();

      listFeeds.mockResolvedValue([]);

      renderHook(() =>
        useFeeds(mockBabyId, { start: startDate, end: endDate })
      );

      await waitFor(() => {
        expect(listFeeds).toHaveBeenCalledWith({
          babyId: mockBabyId,
          startDate,
          endDate,
        });
      });
    });
  });

  describe("useCreateFeed", () => {
    it("should create a new feed", async () => {
      const newFeed = {
        babyId: mockBabyId,
        type: "breast",
        startTime: Date.now(),
      };

      createFeed.mockResolvedValue({
        _id: "new-feed-id" as any,
      });

      const { result } = renderHook(() => useCreateFeed());

      await result.current.mutateAsync(newFeed);

      expect(createFeed).toHaveBeenCalledWith({
        babyId: mockBabyId,
        type: "breast",
        startTime: newFeed.startTime,
      });
    });
  });
});
