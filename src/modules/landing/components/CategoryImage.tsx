// // src/modules/landing/components/CategoryImage.tsx

// import { SupabaseImage } from "@/components/ui/supabaseImage";

// export const CategoryImage = ({
//   category,
//   imageUrl,
//   className = "",
// }: {
//   category: string;
//   imageUrl?: string;
//   className?: string;
// }) => {
//   return (
//     <SupabaseImage
//       src={imageUrl}
//       alt={category}
//       bucket="category"
//       width={200}
//       height={128}
//       className={`w-full h-full ${className}`}
//     />
//   );
// };