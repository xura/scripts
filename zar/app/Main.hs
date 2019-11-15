module Main where

import Data.List
import Data.Monoid
import Options.Applicative

data Sample
  = Hello [String]
  | Goodbye
  deriving (Eq, Show)

hello :: Parser Sample
hello = Hello <$> many (argument str (metavar "TARGET..."))

sample :: Parser Sample
sample = subparser (command "deploy" deploy <> commandGroup "DevOps Commands:" <> hidden)

spaces :: Parser Sample
spaces =
  subparser
    (command "spaces" (info hello (progDesc "Deploy a given --file to Digital Ocean Spaces CDN")) <> metavar "PROVIDER")

deploy :: ParserInfo Sample
deploy = info (spaces <**> helper) (progDesc "Issue a deploy command to a PROVIDER")

run :: Sample -> IO ()
run (Hello targets) = putStrLn $ "Hello, " ++ intercalate ", " targets ++ "!"
run Goodbye = putStrLn "Goodbye."

opts :: ParserInfo Sample
opts = info (sample <**> helper) idm

main :: IO ()
main = execParser opts >>= run